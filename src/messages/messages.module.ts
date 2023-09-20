import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module'; 
import { MessagesGateway } from './websockets.gateway';
import { MessagesService } from './messages.service';
import { ChatGptModule } from 'src/chat-gpt/chat-gpt.module';

@Module({
  imports: [ChatGptModule,CommonModule], 
  providers: [MessagesService],
})
export class MessagesModule {}
