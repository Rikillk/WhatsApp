import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { GroupGateway } from './group.gateway';
import { GroupService } from './group.service';
import { ChatGptModule } from 'src/chat-gpt/chat-gpt.module';

@Module({
  imports: [ChatGptModule,CommonModule],
  providers: [GroupService],
})
export class GroupModule {}
