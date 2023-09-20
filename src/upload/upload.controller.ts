import { Controller, Post, UploadedFiles, UploadedFile, UseInterceptors, HttpException, HttpStatus, Body } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import 'multer'
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileUploadWithBodyDto } from './upload.dto';

@Controller('upload')
export class UploadController {
  private isFileExtensionAllowed(file: Express.Multer.File, allowedExtensions: string[]) {
    const extname = path.extname(file.originalname).toLowerCase();
    return allowedExtensions.includes(extname);
  }

  @Post('single-with-body')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Single file upload with additional data',
    type: FileUploadWithBodyDto,
  })
  async uploadSingleFileWithBody(@UploadedFile() file, @Body() body: FileUploadWithBodyDto) {
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new HttpException('File size exceeds the maximum allowed (2MB)', HttpStatus.BAD_REQUEST);
      }

      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
      if (!this.isFileExtensionAllowed(file, allowedExtensions)) {
        throw new HttpException('Invalid file format. Only images (jpg, jpeg, png) and PDFs are allowed.', HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'File uploaded successfully',
        originalname: file.originalname,
        filename: file.filename,
        additionalData: body,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(@UploadedFiles() files) {
    try {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
      const uploadedFilesInfo = [];

      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          throw new HttpException('File size exceeds the maximum allowed (2MB)', HttpStatus.BAD_REQUEST);
        }

        if (!this.isFileExtensionAllowed(file, allowedExtensions)) {
          throw new HttpException('Invalid file format. Only images (jpg, jpeg, png) and PDFs are allowed.', HttpStatus.BAD_REQUEST);
        }

        uploadedFilesInfo.push({
          originalname: file.originalname,
          filename: file.filename,
        });
      }

      return uploadedFilesInfo;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
