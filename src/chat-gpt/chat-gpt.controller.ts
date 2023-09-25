import { Controller, Post, Body } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { AnalyzeOffensiveDto } from 'src/chat-gpt/analyze-offensive.dto/analyze.offensive.dto';

@Controller('messages')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}

  @Post('/analyze-offensive')
  async analyzeOffensiveMessage(@Body() dto:AnalyzeOffensiveDto): Promise<{ isOffensive: boolean }> {
    try {
      const isOffensive = await this.chatGptService.analyzeOffensiveMessage(dto);

      return { isOffensive };
    } catch (error) {
      throw error;
    }
  }
}
