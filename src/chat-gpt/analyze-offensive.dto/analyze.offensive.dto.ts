
import { IsString } from 'class-validator';

export class AnalyzeOffensiveDto {
  @IsString()
  readonly message: string;
}
