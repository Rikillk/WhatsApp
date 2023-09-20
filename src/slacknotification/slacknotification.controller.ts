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
