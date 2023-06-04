import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';


export class Jwt {
    constructor(
        private jwtService: JwtService
    ) { }


    async SignAuthToken(id: string, email: string): Promise<string> {
        const token = await  this.jwtService.signAsync({ id: id, email: email });
        return token;
    }

    async signAuthCookie(id: string, email: string): Promise<string> {
        const random = new Date().toDateString();
        const token = this.jwtService.signAsync({ email: email, id: id, random: random });
        return token;
    }
}

