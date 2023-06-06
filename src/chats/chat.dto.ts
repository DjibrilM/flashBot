import { IsNotEmpty, IsAlphanumeric } from "class-validator";

export class createChatDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    chatName: string
}

export class createMessageDto {
    @IsNotEmpty()
    chatId: string

    @IsNotEmpty()
    ownerId: string
}

export class deleteChatDto {
    @IsNotEmpty()
    chatId: string
}