import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsString, IS_EMAIL } from "class-validator";



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

export class requestPasswordUpdate {
    @IsNotEmpty()
    @IsEmail()
    email: string;


    @IsNotEmpty()
    password: string
}

export class updatePasswordDto {
    @IsEmail()
    email: string


    @IsNotEmpty()
    newPassword: string

    @IsNotEmpty()
    previousPassword: string
}