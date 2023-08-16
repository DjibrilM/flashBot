import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose'
import * as mongoose from 'mongoose';
import { User } from "./user.schema";
import { Message } from "./message.schema";



export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    owner: User;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }])
    messages: Message[]
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
