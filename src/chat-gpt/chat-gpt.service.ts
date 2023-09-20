import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatGptService {
    private readonly openAIApi:OpenAI;
    constructor(){
        
        
        this.openAIApi = new OpenAI({
            organization: process.env.ORGANIZATION_ID,
            apiKey: process.env.OPENAI_API_KEY
        });

    }
    async analyzeOffensiveMessage(message: string): Promise<boolean> {
        try {
          const response = await this.openAIApi.completions.create({
            model:'davinci-002',
            prompt: `Is the following message offensive? "${message}"`,
            max_tokens: 1,
          });
    
          const isOffensive = response.choices[0].text.toLowerCase() === 'yes';
          return isOffensive;
        } catch (error) {
          console.error('Error analyzing message:', error);
          throw error;
        }
      }
}
