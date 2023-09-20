import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ChatGptService } from 'src/chat-gpt/chat-gpt.service'; 
import { UsersService } from 'src/user/user.service'; 
@Injectable()
export class OffensiveMessageMiddleware implements NestMiddleware {
  constructor(
    private readonly chatGptService: ChatGptService,
    private readonly userService: UsersService // Inject your user service
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { content, receiverId, groupId } = req.body; 

    try {
      const isOffensive = await this.chatGptService.analyzeOffensiveMessage(content);

      if (isOffensive) {
        
        await this.userService.blockUser(req.user.id, receiverId);
    
        res.status(400).json({ message: 'Offensive message detected' });
      } else {
        next();
      }
    } catch (error) {
      console.error('Error analyzing message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
