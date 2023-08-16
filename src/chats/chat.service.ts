import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "src/database/schemas/chats.schema";
import { Message } from "src/database/schemas/message.schema";
import mongoose from "mongoose";
const { Configuration, OpenAIApi } = require("openai");



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

        try {

            const configuration = new Configuration({
                organization: "org-IViR4SfY8HJAWD8rGBjTOH1p",
                apiKey: "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",
            });
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                max_tokens: 3000,
                temperature: 0,
                messages: [{ role: "user", content: "He" }],
            });
            console.log(completion.data.choices[0].message);

            // const createMessage = await this.messageModel.create(
            //     {
            //         owner: owner,
            //         chatId: chatId
            //     }
            // );
        } catch (error) {
            console.log(error.message);
            throw new InternalServerErrorException(error.message)
        }


    }
}