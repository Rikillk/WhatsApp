
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatGptService } from 'src/chat-gpt/chat-gpt.service';




@Injectable()
export class OffensiveMessageGuard implements CanActivate {
  constructor(private readonly messageService: ChatGptService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const payload = context.getArgs()[1];

    const isOffensive = await this.messageService.analyzeOffensiveMessage(payload.content);

    if (isOffensive) {
      client.disconnect();
      return false;
    }

    return true;
  }
}





