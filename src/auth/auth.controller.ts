import { Body, Controller, Get, Post, Res, Req, } from "@nestjs/common";
import { createUserDto, loginDto, verifyToken } from "./auth.dto";
import { createUserResult } from "./interfaces";
import { auth as authService } from "./auth.service";
import { Response as responseType, Request as RequestType } from "express";

@Controller('auth')
export class auth {
    constructor(private readonly authService: authService) { }

    @Post('register')
    async createUser(@Body() body: createUserDto, @Res({ passthrough: true }) response: responseType): Promise<createUserResult | any> {
        const createUser = await this.authService.create(body.email, body.password, body.profileImage);
        response.cookie("authCookie", createUser.authCookie, {
            httpOnly: true,
            sameSite: false
        });

        response.status(201).json({
            email: createUser.email,
            authToken: createUser.authToken,
            id: createUser.id,
            profileImage: createUser.profileImage
        });
    }

    @Post("verifyToken")
    verifyToken(@Body() body: verifyToken, @Req() request: RequestType) {
        const authenticationCookie = request.cookies.authCookie;
        console.log(authenticationCookie);
        const authenticationToken = body.token;

        return this.authService.verifyToken(authenticationCookie, authenticationToken);
    }

    @Post('login')
    async login(@Body() body: loginDto, @Res({ passthrough: true }) response: responseType): Promise<createUserResult | any> {
        const createUser = await this.authService.login(body.email, body.password);
        response.cookie("authCookie", createUser.authCookie, {
            httpOnly: true,
            sameSite: false
        });

        response.status(200).json({
            email: createUser.email,
            authToken: createUser.authToken,
            profileImage: createUser.profileImage,
        })
    }
}

