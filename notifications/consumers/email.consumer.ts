import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notifications')
export class EmailConsumer {
  @Process('email')
  async sendEmail(job: Job<{ userId: string; message: string }>) {
    console.log(`Enviando e-mail para ${job.data.userId}: ${job.data.message}`);
  }
}