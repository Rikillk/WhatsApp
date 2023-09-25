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
