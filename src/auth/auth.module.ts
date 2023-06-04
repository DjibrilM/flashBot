import { Module } from "@nestjs/common";
import { auth as authController } from './auth.controller';
import { auth as authServices } from "./auth.service";
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from "src/database/schemas/user.schema";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [ConfigModule.forRoot(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), JwtModule.register({ secret: process.env.JWT_SECRET, })],
    controllers: [authController],
    providers: [authServices]
})
export class auth { };