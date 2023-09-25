import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SignDto{
 

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    password: string

}