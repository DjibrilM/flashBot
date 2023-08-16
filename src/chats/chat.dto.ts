import { IsNotEmpty, IsAlphanumeric, IsOptional, } from "class-validator";

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