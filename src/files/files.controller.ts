import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
    @ApiOperation({ summary: 'Serve a file inline' })
    @Get('inline')
    @ApiResponse({
        status: 200,
        description: 'File served inline',
        content: {
          'application/pdf': {},
        },
      })
    serveFileInline(@Res() res: Response): void {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="Form 2 (7) (1).pdf"');

        const filePath = '/Users/rikillkumar/Downloads/Form 2 (7) (1).pdf';

        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send(fileData);
            }
        });
    }

    @Get('attachment')
    serveFileAttachment(@Res() res: Response): void {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="PF Declaration form (11) (1).pdf"');

        const filePath = '/Users/rikillkumar/Downloads/PF Declaration form (11) (1).pdf';

        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send(fileData);
            }
        });
    }
}
