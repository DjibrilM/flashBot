import { Body, Controller, Request, Post, Res, Req, UseGuards, } from "@nestjs/common";
import { createUserDto, loginDto, requestPasswordUpdate, verifyToken, updatePasswordDto, DeleteUserDto } from "./auth.dto";
import { createUserResult } from "./interfaces";
import { auth as authService } from "./auth.service";
import { Response as responseType, Request as RequestType } from "express";
import { requestPasswordUpdateInterface } from "./interfaces";
import { AuthorizationGuard } from "src/guards/authorization.guards";


@Controller('auth')
export class auth {
    constructor(private readonly authService: authService) { }

    @Post('register')
    async createUser(@Body() body: createUserDto, @Res({ passthrough: true }) response: responseType): Promise<createUserResult | any> {
        const createUser = await this.authService.create(body.email, body.password, body.profileImage);
        response.cookie("authCookie", createUser.authCookie, {
            httpOnly: false,
            sameSite: false
        });

        return response.status(201).json({
            email: createUser.email,
            authToken: createUser.authToken,
            id: createUser.id,
            profileImage: createUser.profileImage
        });
    }

    @Post("verifyToken")
    verifyToken(@Body() body: verifyToken, @Req() request: RequestType) {
        const authenticationCookie = request.cookies.authCookie;
        const authenticationToken = body.token;
        return this.authService.verifyToken(authenticationCookie, authenticationToken);
    }

    @Post('login')
    async login(@Body() body: loginDto, @Res({ passthrough: true }) response: responseType): Promise<createUserResult | any> {
        const createUser = await this.authService.login(body.email, body.password);
        response.cookie("authCookie", createUser.authCookie, {
            httpOnly: false,
            sameSite: false
        });

        return response.status(200).json({
            email: createUser.email,
            authToken: createUser.authToken,
            profileImage: createUser.profileImage,
        })
    }

    @UseGuards(AuthorizationGuard)
    @Post('requestPasswordUpdate')
    requestPasswordUpdate(@Body() body: requestPasswordUpdate): requestPasswordUpdateInterface | unknown {
        return this.authService.requestpasswordUpdateService(body.email, body.password)
    }

    @UseGuards(AuthorizationGuard)
    @Post('updatePassword')
    updatePassword(@Body() body: updatePasswordDto): Promise<string> {
        return this.authService.updatePassword(body.email, body.newPassword, body.previousPassword);
    }

    @UseGuards(AuthorizationGuard)
    @Post("deleteAccount")
    async areset(@Body() body: DeleteUserDto, @Request() request: RequestType | any) {
        return this.authService.deleteAccount(body.email, body.password, request.user);
    }
}

