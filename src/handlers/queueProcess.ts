import { PrismaClient } from '@prisma/client';
import { execCode } from './CodeExecution'; 

const prisma = new PrismaClient();

const processQueue = async () => {
  while (true) {
    console.log('Checking for jobs to process...');

    const jobs = await prisma.executionQueue.findMany({
      where: { status: 'queued' }, 
    });

    for (const job of jobs) {
      try {
        console.log(`Processing job ID: ${job.id}`);


        const result = await execCode(job.languageID, job.sourceCode, job.stdin, job.timeout);

  
        await prisma.executionQueue.update({
          where: { id: job.id },
          data: {
            status: result.status,
            stdout: result.stdout,
            stderr: result.stderr,
          },
        });

        console.log(`Job ${job.id} processed successfully.`);
      } catch (error : any) {
        console.error(`Error processing job ${job.id}:`, error);

        await prisma.executionQueue.update({
          where: { id: job.id },
          data: { status: 'failed', stderr: error.message },
        });
      }
    }


    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

processQueue().catch(error => console.error('Error in queue processor:', error));
