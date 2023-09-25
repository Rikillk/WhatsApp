// recaptcha.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaMiddleware implements NestMiddleware {
  constructor() {}

  async use(req, res, next) {
    const { recaptchaResponse } = req.body;

    try {
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret:'6LeE3jwoAAAAADXx3I9swaz3cic1xyGrHQYNsTNg',
            response: recaptchaResponse,
          },
        },
      );

      if (response.data.success) {
        next();
      } else {
        // CAPTCHA verification failed
        res.status(400).json({ message: 'CAPTCHA verification failed' });
      }
    } catch (error) {
      console.error('CAPTCHA verification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
