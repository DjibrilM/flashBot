import { IsEmail, IsNotEmpty, MinLength, MaxLength, isAlphanumeric } from "class-validator";


export class createUserDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    password: string

    @IsNotEmpty()
    profileImage:string
}