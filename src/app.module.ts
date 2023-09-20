import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { LocalStrategy } from './auth/local.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { MessagesModule } from './messages/messages.module';
import { GroupModule } from './group/group.module';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { CommonModule } from './common/common.module';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGptService } from './chat-gpt/chat-gpt.service';
import { UsersService } from './user/user.service';
import { PushNotificationModule } from './push-notifications/push-notifications.module';
import { PushNotificationController } from './push-notifications/push-notifications.controller';
import { PushNotificationService } from './push-notifications/push-notifications.service';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload/upload.controller';
import { SlackNotificationService } from './slacknotification/slacknotification.service';
import { SlackController } from './slacknotification/slacknotification.controller';
import { HttpModule } from '@nestjs/axios';
import { SlackCronService } from './slacknotification/slack-cron.service';


@Module({
  imports: [AuthModule, PrismaModule, UsersModule, PassportModule,MessagesModule,GroupModule,HttpModule,EmailModule,
    JwtModule.register({ 
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1h' },
    }),  MulterModule.register({
      dest: './uploads', // Specify the upload directory
    }),
    CommonModule,
    ChatGptModule,ConfigModule.forRoot(), PushNotificationModule    
],
  providers: [PrismaService, LocalStrategy,AuthService,MessagesService,GroupService,EmailService,ChatGptService,UsersService,PushNotificationService, SlackCronService,SlackNotificationService],
  controllers: [MessagesController,GroupController,PushNotificationController,UploadController, SlackController],
})
export class AppModule {}
