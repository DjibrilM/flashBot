import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose'
import * as mongoose from 'mongoose';
import { User } from "./user.schema";
import { Chat } from "./chats.schema";


export type messageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    owner: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true })
    chatId: Chat;

    @Prop({ required: true })
    prompt: string;

    @Prop({ required: true })
    result: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);