import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SlackNotificationService {
  constructor(private httpService: HttpService) {}

  async sendSlackMessage(message: string, webhookUrl: string): Promise<void> {
    try {
      const payload = {
        text: message,
      };

      await this.httpService.post(webhookUrl, payload).toPromise();
    } catch (error) {
      console.error('Error sending message to Slack:', error);
    }
  }
}
