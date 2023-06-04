import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { createUserDto } from "./auth.dto";
import { createUserResult } from "./interfaces";
import { auth as authService } from "./auth.service";
import { Response as responseType } from "express";


@Controller('auth')
export class auth {
    constructor(private readonly authService: authService) { }

    @Post('register')
    async createUser(@Body() body: createUserDto, @Res({ passthrough: true }) response: responseType): Promise<createUserResult | any> {
        const createUser = await this.authService.create(body.email, body.password, body.profileImage);
        response.cookie("authCookie", createUser.authCookie);

        response.status(201).json({
            email: createUser.email,
            authToken: createUser.authToken
        })
    }

    @Post('login')
    async login() {

    }
}

