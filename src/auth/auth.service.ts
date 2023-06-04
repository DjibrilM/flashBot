import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InternalServerErrorException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User } from "../database/schemas/user.schema";
import { Model } from "mongoose";
import { createUserProviderResult } from "./interfaces";
import { hashPassword, compare } from "src/helpers/bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Jwt } from "src/helpers/jwt";

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
        try {
            const createUser = await this.userModel.create({
                email: email,
                password: hashedPassword,
                profileImage: profileImage
            });

            const jw = new Jwt(this.jwtService);
            const cookieToken = await jw.signAuthCookie(createUser.id, createUser.email);
            const authToken = await jw.SignAuthToken(createUser.id, createUser.email);

            return {
                email: createUser.email,
                authCookie: cookieToken,
                authToken: authToken
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("server error");
        }
    }

    async login(password: string, email: string) {
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
}