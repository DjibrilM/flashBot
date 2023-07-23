import { IsEmail, IsNotEmpty, MinLength, MaxLength, isAlphanumeric, IsString } from "class-validator";



export class createUserDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    password: string

    @IsNotEmpty()
    profileImage: string
}

export class loginDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    password: string
}


export class verifyToken {
    @IsString()
    @IsNotEmpty()
    token: string
}