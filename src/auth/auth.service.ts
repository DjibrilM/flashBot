import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InternalServerErrorException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User } from "../database/schemas/user.schema";
import { Model } from "mongoose";
import { createUserProviderResult } from "./interfaces";
import { hashPassword, compare } from "src/helpers/bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Jwt } from "src/helpers/jwt";
import { Email } from "src/helpers/email";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class auth {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) { }

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
            console.log(error)
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
            authToken: authToken
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
            };
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException(error.message);
        }
    }

}
