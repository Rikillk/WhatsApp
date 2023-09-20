import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PushNotificationController } from './push-notifications.controller';
import { PushNotificationService } from './push-notifications.service';

@Module({
  imports: [PrismaModule],
  controllers: [PushNotificationController],
  providers: [PushNotificationService],
})
export class PushNotificationModule {}
