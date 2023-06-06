import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "src/database/schemas/chats.schema";
import { Message } from "src/database/schemas/message.schema";
import mongoose from "mongoose";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>, @InjectModel(Message.name) private messageModel: Model<Message>) { }
    async createChat(owner: string, name: string) {
        try {
            const newChat = await this.chatModel.create({
                owner: owner,
                name: name
            });

            return newChat;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    };

    async getChats(owner: string) {
        try {
            const getChats = await this.chatModel.find({
                owner: owner
            });
            return getChats;
        } catch (error) {
            throw new InternalServerErrorException("can't load chats")
        }

    };

    async deleteChat(chatId: string, ownerId: any) {
        try {
            const findChat = await this.chatModel.findById(new mongoose.Types.ObjectId(chatId));
            if (findChat.owner.toString() !== ownerId) {
                throw new UnauthorizedException();
            }
            const deleteChat = await this.chatModel.findByIdAndRemove(chatId);
            return "Chat deleted";

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

    async createMessage(chatId: string, owner: string) {
        const createMessage = await this.messageModel.create(
            {
                owner: owner,
                chatId: chatId
            }
        );
        return chatId;
    }
}