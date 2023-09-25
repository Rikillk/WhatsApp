// // email.worker.ts

// import { Injectable } from '@nestjs/common';
// import { Worker } from 'bullmq';
// import { Queue } from 'bullmq-nestjs';

// @Injectable()
// export class EmailWorker {
//   constructor(@Queue('email') private emailQueue: Worker) {
//     this.initializeEmailWorker();
//   }

//   private initializeEmailWorker() {
//     this.emailQueue.process(async (job) => {
//       // Process the email task here
//       console.log('Processing email task:', job.data);
//       // Send the email
//       // ...
//     });
//   }
// }
