import { Controller, Post, Get, Delete, UseGuards, Request, Body, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request as RequestType } from "express";
import { createMessageDto, deleteChatDto } from "./chat.dto";
import { AuthorizationGuard } from "src/guards/authorization.guards";




@Controller("conversation")
export class ChatController {
    constructor(private chatService: ChatService) { }

    @UseGuards(AuthorizationGuard)
    @Post('chat')
    async createChat(@Request() request: RequestType | any,) {
        return this.chatService.createChat(request.user);
    }

    @UseGuards(AuthorizationGuard)
    @Get("chats")
    async getChats(@Request() request: RequestType | any, @Query('pagination') pagination: number) {
        return this.chatService.getChats(request.user, pagination);
    }

    @UseGuards(AuthorizationGuard)
    @Post("delete-chat")
    deleteChat(@Body() body: deleteChatDto, @Request() request: RequestType | any) {
        return this.chatService.deleteChat(body.chatId, request.user,);
    }

    @UseGuards(AuthorizationGuard)
    @Post('message')
    async postMessage(@Body() createMessage: createMessageDto,  @Request() request: RequestType | any) {
        return this.chatService.createMessage(createMessage.chatId, request.user, createMessage.prompt);
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




