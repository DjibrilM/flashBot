import { JwtService } from '@nestjs/jwt';

export class Jwt {
    constructor(
        private jwtService: JwtService
    ) { }


    async SignAuthToken(id: string, email: string): Promise<string> {
        const token = await this.jwtService.signAsync({ id: id, email: email });
        return token;
    }

    async signAuthCookie(id: string, email: string): Promise<string> {
        const random = new Date().toDateString();
        const token = this.jwtService.signAsync({ email: email, id: id, random: random });
        return token;
    }

    async veryToken(payload: string): Promise<any> {
        const verify = this.jwtService.verify(payload, { secret: process.env.JWT_SECRET });
        return verify;
    }
}

