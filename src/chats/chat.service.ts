import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "src/database/schemas/chats.schema";
import { Message } from "src/database/schemas/message.schema";
import mongoose from "mongoose";
import { openAiHelper } from "src/helpers/openai";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>, @InjectModel(Message.name) private messageModel: Model<Message>) { }
    async createChat(owner: string) {
        try {
            const newChat = await this.chatModel.create({
                owner: owner,
            });

            return newChat;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    };

    async getChats(owner: string, skip: number) {
        try {
            const getChats = await this.chatModel.find({
                owner: owner
            }).skip((skip - 1) * 4).limit(4).populate("messages");

            const itemCount = await this.chatModel.find({
                owner: owner
            }).count();

            return { chats: getChats, itemsCount: itemCount };
        } catch (error) {
            throw new InternalServerErrorException("can't load chats")
        }

    };

    async deleteChat(chatId: string, ownerId: any) {
        try {
            const findChat = await this.chatModel.findById(new mongoose.Types.ObjectId(chatId));
            if (!findChat) {
                console.log("chat not found !")
                throw new Error("Chat not found");
            }

            if (findChat.owner.toString() !== ownerId) {
                throw new UnauthorizedException();
            }
            const deleteChat = await this.chatModel.findByIdAndRemove(chatId);
            return "Chat deleted";

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async createMessage(chatId: string, owner: string, prompt: string) {
        try {
            const openai = new openAiHelper().createMessage;
            const sendRequest = await openai(prompt);
            const chat = await this.chatModel.findById(chatId);


            const createMessage = await this.messageModel.create({
                owner: owner,
                chatId: chatId,
                prompt: prompt,
                result: sendRequest.content
            });

            chat.messages.push(createMessage);
            chat.save();

            return createMessage;
        } catch (error) {
            console.log(error.message);
            throw new InternalServerErrorException(error.message)
        }
    }
}