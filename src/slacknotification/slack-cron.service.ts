import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { SlackNotificationService } from './slacknotification.service';

@Injectable()
export class SlackCronService {
  constructor(private readonly slackNotificationService: SlackNotificationService) {
    this.setupCronJobs();
  }

  private setupCronJobs() {
    cron.schedule('0 11 * * *', () => {
      this.sendDailySlackMessage();
    });
  }

  private sendDailySlackMessage() {
    const message = 'Good morning, Slack!';

    const webhookUrl = 'https://hooks.slack.com/services/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';

    this.slackNotificationService.sendSlackMessage(message, webhookUrl);
  }
}
