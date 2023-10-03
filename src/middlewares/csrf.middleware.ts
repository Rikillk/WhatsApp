// csrf.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser'; // Import cookie-parser

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection = csurf({ cookie: true });

  use(req, res, next) {
    // Apply cookie-parser middleware before csurf
    cookieParser()(req, res, () => {
      return this.csrfProtection(req, res, next);
    });
  }
}
