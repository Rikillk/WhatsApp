import { Controller, Post, Body } from '@nestjs/common';
import { SlackNotificationService } from 'src/slacknotification/slacknotification.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackNotificationService) {}

  @Post('sendmessage')
  async sendSlackMessage(@Body() body: { message: string }) {
    const webhookUrl = 'https://hooks.slack.com/services/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';

    await this.slackService.sendSlackMessage(body.message, webhookUrl);

    return { message: 'Message sent to Slack' };
  }
}
