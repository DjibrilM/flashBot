import { IsNotEmpty, IsAlphanumeric, } from "class-validator";

export class createMessageDto {
    @IsNotEmpty()
    chatId: string

    @IsNotEmpty()
    prompt:string
}
export class deleteChatDto {
    @IsNotEmpty()
    chatId: string
}
