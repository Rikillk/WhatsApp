// src/swagger.config.ts

import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('WhatsApp Clone-with AI')
  .setDescription('Contains different endpoints for features ')
  .setVersion('3.1.0')
  .addTag('API')
  .addTag('Uploads') // Add a new tag for file uploads
  .build();
