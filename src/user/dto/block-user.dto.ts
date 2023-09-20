import { IsInt } from 'class-validator';

export class BlockUserDto {
  @IsInt()
  readonly blockedId: number;
}
