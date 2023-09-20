
import { IsString, IsNotEmpty, IsInt, IsIn, IsDate, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsInt()
  senderId: number;

  @IsInt()
  receiverId: number;

  @IsString()
  @IsIn(['text']) 
  type: string = 'text'; 
  @IsString()
  @IsIn(['sent', 'delivered', 'read']) 
  @IsOptional() 
  messageStatus?: string;

  @IsDate()
  @IsOptional() 
  createdAt?: Date;

}
