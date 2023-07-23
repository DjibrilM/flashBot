import { Controller, Post, Get, Delete, UseGuards, Request, Body } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request as RequestType } from "express";
import { createChatDto, createMessageDto, deleteChatDto } from "./chat.dto";
import { AuthorizationGuard } from "src/guards/authorization.guards";


@Controller("conversation")
export class ChatController {
    constructor(private chatService: ChatService) { }

    @UseGuards(AuthorizationGuard)
    @Post('chat')
    async createChat(@Body() body: createChatDto, @Request() request: RequestType | any) {
        return this.chatService.createChat(request.user, body.chatName)
    }

    @UseGuards(AuthorizationGuard)
    @Get("chats")
    async getChats(@Request() request: RequestType | any) {
        console.log(request.user)
        return this.chatService.getChats(request.user)
    }

    @UseGuards(AuthorizationGuard)
    @Delete("chat")
    deleteChat(@Body() body: deleteChatDto, @Request() request: RequestType | any) {
        return this.chatService.deleteChat(body.chatId, request.user,);
    }

    @UseGuards(AuthorizationGuard)
    @Post('message')
    async postMessage(@Body() body: createMessageDto, @Request() request: RequestType) {
        return this.chatService.createMessage("d", "d");
    }

    @UseGuards(AuthorizationGuard)
    @Get('messages')
    async getMessage() {

    }

    @UseGuards(AuthorizationGuard)
    @Delete('message')
    delete() {

    }
}




