// Define a TypeScript interface for a user

import { User } from "@prisma/client";

  
  // Extend the Request interface in @types/express.d.ts
  declare module 'express' {
    interface Request {
      user: User;
    }
  }