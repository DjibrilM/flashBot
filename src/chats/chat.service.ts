import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "src/database/schemas/chats.schema";
import { Message } from "src/database/schemas/message.schema";


@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private userModel: Model<Chat>, @InjectModel(Message.name) private message: Model<Message>) { }
    
}