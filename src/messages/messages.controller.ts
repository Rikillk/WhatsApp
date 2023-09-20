import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, UseInterceptors, NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
//import { JwtAuthGuard } from '../auth/auth.guard'; 
import { MessageDto } from './dto/message.dto';
import { OffensiveMessageMiddleware } from 'src/middlewares/offensive-message.middleware';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  
  @UseInterceptors(OffensiveMessageMiddleware)
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto): Promise<MessageDto> {
  const message = await this.messagesService.createMessage(createMessageDto);
    return message;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<MessageDto> {
   const message = await this.messagesService.findMessageById(id);
   return message;
  }
  @Post(':id/delete')
  async softDeleteMessage(@Param('id') messageId: number) {
    try {
      await this.messagesService.softDeleteMessage(messageId);
      return { message: 'Message deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Message not found');
      }
      throw error;
    }
  }

}
