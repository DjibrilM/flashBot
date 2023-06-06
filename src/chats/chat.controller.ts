import { Controller, Post, Get, Delete, UseGuards, Request, Body } from "@nestjs/common";
import { ChatService } from "./chat.service";
import {Request as RequestType } from "express";
import { createChatDto, createMessageDto, deleteChatDto } from "./chat.dto";

@Controller("conversation")
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post('chat')
    async createChat(@Body() body: createChatDto, @Request() request: RequestType | any) {
        return this.chatService.createChat(request.user, body.chatName)
    }

    @Get("chats")
    async getChats(@Request() request: RequestType | any) {
        console.log(request.user)
        return this.chatService.getChats(request.user)
    }

    @Delete("chat")
    deleteChat(@Body() body: deleteChatDto, @Request() request: RequestType | any) {
        return this.chatService.deleteChat(body.chatId, request.user,);
    }

    @Post('message')
    async postMessage(@Body() body: createMessageDto, @Request() request: RequestType) {

    }


    @Get('messages')
    async getMessage() {

    }


    @Delete('message')
    delete() {

    }


}




