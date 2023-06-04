import { Controller, Post, Get, Delete, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";


@Controller("conversation")
export class ChatController {
    constructor(chatService: ChatService) { }

    @Post('chat')
    async createChat() {
        return 'stupid'
    }

    @Get("chats")
    async getChats() {

    }

    @Delete("chat")
    deleteChat() {

    }

    @Post('message')
    async postMessage() {

    }


    @Get('messages')
    async getMessage() {

    }


    @Delete('message')
    delete() {

    }


}




