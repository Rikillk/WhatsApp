// // email-worker.ts

// import { Worker, WorkerOptions } from 'bullmq';
// import { EmailService } from './email.service'; // Import your EmailService
// import { EmailQueueService } from './email-queue.service'; // Import your EmailQueueService
// import { EmailModule } from './email.module'; // Import your EmailModule
// import { NestFactory } from '@nestjs/core';

// async function bootstrap() {
//   // Initialize your Nest.js application context
//   const app = await NestFactory.createApplicationContext(EmailModule);


//   // Inject the required services
//   const emailService = app.get(EmailService);
//   const emailQueueService = app.get(EmailQueueService);

//   // Set up BullMQ
//   const emailQueue = new Worker('email', async job => {
//     const { to } = job.data;

//     // Use the injected EmailService to send emails
//     try {
//       await emailService.sendWelcomeMail(to);
//       console.log(`Email sent to ${to}`);
//     } catch (err) {
//       console.error(`Error sending email to ${to}:`, err);
//     }
//   });
//   emailQueue.on('completed', (job, result) => {
//     console.log(`Job ID ${job.id} completed: ${result}`);
//   });
  
//   emailQueue.on('failed', (job, err) => {
//     console.error(`Job ID ${job.id} failed: ${err.message}`);
//   });
  
//   await app.close();
// }

// bootstrap();
