 import { Injectable, Logger } from '@nestjs/common';
 import { HttpService } from '@nestjs/axios';
import { Sentry } from 'src/sentry.config';

 @Injectable()
 export class SlackNotificationService {
  private readonly logger = new Logger(SlackNotificationService.name);
   constructor(private httpService: HttpService) {}


   async sendSlackMessage(message: string, webhookUrl: string): Promise<void> {
    try {
      const payload = {
        text: message,
      };

      await this.httpService.post(webhookUrl, payload).toPromise();

      this.logger.log(`Message sent to Slack successfully: ${message}`);
    } catch (error) {
      Sentry.captureException(error);

      this.logger.error(`Error sending message to Slack: ${error.message}`);
      console.error('Error sending message to Slack:', error);
    }
  }

 }
