// // email-queue.service.ts

// import { Injectable } from '@nestjs/common';
// import { Queue } from 'bull';
// import { InjectQueue } from '@nestjs/bull';

// @Injectable()
// export class EmailQueueService {
//   constructor(@InjectQueue('email') private emailQueue: Queue) {}

//   async sendWelcomeMail(to: string) {
//     await this.emailQueue.add('send-welcome-mail', { to });
//   }
// }
