import { Injectable, UnauthorizedException, HttpException, HttpStatus, RequestTimeoutException } from "@nestjs/common";
import { InternalServerErrorException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User } from "../database/schemas/user.schema";
import { Model } from "mongoose";
import { createUserProviderResult, requestPasswordUpdateInterface } from "./interfaces";
import { hashPassword, compare } from "src/helpers/bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Jwt } from "src/helpers/jwt";
import { v4 as uuidv4 } from 'uuid';
import { Chat } from "src/database/schemas/chats.schema";
import { Message } from "src/database/schemas/message.schema";


@Injectable()
export class auth {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService, @InjectModel(Chat.name) private chatModel: Model<Chat>, @InjectModel(Message.name) private messageModel: Model<Message>) { }

    async create(email: string, password: string, profileImage: string): Promise<createUserProviderResult> {
        //check id user already exist
        const findUser = await this.userModel.findOne({ email: email });

        if (findUser) {
            throw new ForbiddenException("user with this email already exit 🙄🙄🙄🙄");
        }

        //try to create user
        const hashedPassword = await hashPassword(password);
        const verificationId = uuidv4();

        try {
            const createUser = await this.userModel.create({
                email: email,
                password: hashedPassword,
                profileImage: profileImage,
                confirmed: false,
                confirmationToken: verificationId,
            });

            const jw = new Jwt(this.jwtService);
            const cookieToken = await jw.signAuthCookie(createUser.id, createUser.email);
            const authToken = await jw.SignAuthToken(createUser.id, createUser.email);

            return {
                email: createUser.email,
                authCookie: cookieToken,
                authToken: authToken,
                id: createUser.id,
                profileImage: createUser.profileImage
            }
        } catch (error) {
            throw new InternalServerErrorException("server error");
        }
    }

    async login(email: string, password: string,) {
        //find account
        const user = await this.userModel.findOne({ email: email });

        if (!user) {
            throw new ForbiddenException("user with this email does not exist");
        }

        //compare password
        const comparePassword = await compare(user.password, password);
        if (!comparePassword) {
            throw new UnauthorizedException("Wrong password");
        }

        const jw = new Jwt(this.jwtService);

        const cookieToken = await jw.signAuthCookie(user.id, user.email);
        const authToken = await jw.SignAuthToken(user.id, user.email);

        return {
            email: user.email,
            authCookie: cookieToken,
            authToken: authToken,
            profileImage: user.profileImage,
        }

    }

    async verifyToken(authCookie: string, autToken: string) {
        const jwt = new Jwt(this.jwtService);
        try {
            const verifyAuthToken = await jwt.veryToken(autToken);
            const verifyCookieToken = await jwt.veryToken(authCookie);
            if (verifyAuthToken.id !== verifyCookieToken.id) throw new Error("wrong token");

            const user = await this.userModel.findById(verifyAuthToken.id);


            return {
                profileImage: user.profileImage,
                id: user._id,
                email: user.email,
            };
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException(error.message);
        }
    }


    async requestpasswordUpdateService(email: string, password: string): Promise<requestPasswordUpdateInterface> {
        try {
            const user = await this.userModel.findOne({ email: email });

            if (!user) {
                const error = new Error("user not found");
                throw error;
            }

            const comparePassword = await compare(user.password, password);

            if (!comparePassword) {
                const error = new Error("🔔 Wrong Password");
                throw error;
            }

            return {
                canUpdate: true
            }
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }
    }

    updatePassword = async (email: string, newPassword: string, previousPassword: string) => {
        try {
            const user = await this.userModel.findOne({
                email: email
            });

            //check if the user exists
            if (!user) throw new Error("Invalid crediential");

            //compare the previous password once again
            const comparePassword = await compare(user.password, previousPassword);
            // if (!comparePassword) throw new Error("Invalid crediential")

            //updatePassword
            user.password = await hashPassword(newPassword);
            await user.save();

            return 'password updated';
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async resetPassword(email: string) {
        try {
            const user = await this.userModel.findOne({ email: email })
            if (!user) {
                throw Error("user not found");
            }
            user.passwordResetKey = await uuidv4();
            await user.save()

            setTimeout(async () => {
                user.passwordResetKey = null;
                await user.save()
            }, 1000 * 120);

            return 'email sent'
        } catch (error) {

        }
    }

    async deleteAccount(email: string, password: string, id: string) {
        try {
            const findUser = await this.userModel.findById(id);
            const comparePassword = await compare(findUser.password, password);
            if (!comparePassword) {
                throw new Error("wrong password")
            }

            //delete all message attached to the user 
             await this.messageModel.deleteMany({ owner: id });
            //delete chats 
            await this.chatModel.deleteMany({ owner: id });

             await this.userModel.findOneAndRemove({ email: email });


            return 'your account has been deleted with all your data...'
        } catch (error) {
            console.log(error, 'failed to delete accout data');
            throw new UnauthorizedException(error.message);
        }
    }
}
