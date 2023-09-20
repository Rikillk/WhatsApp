// auth.middleware.ts

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service'; // Implement AuthService to verify JWT tokens
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Authentication token missing.');
    }

    try {
      const user = await this.authService.verifyToken(token);
      req.user = user; 
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
