import { Module } from "@nestjs/common";
import { Chat, ChatSchema } from "src/database/schemas/chats.schema";
import { Message, MessageSchema } from 'src/database/schemas/message.schema'
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatController } from './chat.controller'
import { ChatService } from "./chat.service";
import { AuthorizationGuard } from "src/guards/authorization.guards";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        JwtModule.register({ secret: process.env.JWT_SECRET, })
    ],
    controllers: [ChatController],
    providers: [ChatService, { provide: APP_GUARD, useClass: AuthorizationGuard }]
})

export class ChatModule { }
