import { ApiProperty } from "@nestjs/swagger";

export class FileUploadWithBodyDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  
    @ApiProperty()
    otherData: string;
  }