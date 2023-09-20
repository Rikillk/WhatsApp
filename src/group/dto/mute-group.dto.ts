import { IsInt, IsDate } from 'class-validator';

export class MuteGroupDto {
  @IsInt()
  userId: number;
 
  muteUntil: Date;
}