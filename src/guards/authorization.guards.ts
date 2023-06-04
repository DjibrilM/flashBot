import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Jwt } from 'src/helpers/jwt';


@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean | any> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const cookies = request.cookies.authCookie;

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const jwt = new Jwt(this.jwtService);
            const payload = await jwt.veryToken(token);
            const cookiePayload = await jwt.veryToken(cookies);

            if (payload.id !== cookiePayload.id) {
                throw new UnauthorizedException();
            }

            request['user'] = payload.id;

        } catch (error) {
            console.log(error);
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}