import { Module } from '@nestjs/common';
import { CombinedGateway } from './combined.gateway';
import { MessagesService } from 'src/messages/messages.service';
import { GroupService } from 'src/group/group.service';
import { ChatGptService } from 'src/chat-gpt/chat-gpt.service';
import { PushNotificationService } from 'src/push-notifications/push-notifications.service';

@Module({

  providers: [CombinedGateway,MessagesService,GroupService,ChatGptService,PushNotificationService],
  exports: [CombinedGateway],
})
export class CommonModule {}
