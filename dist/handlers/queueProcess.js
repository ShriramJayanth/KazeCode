"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const CodeExecution_1 = require("./CodeExecution");
const prisma = new client_1.PrismaClient();
const processQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bam");
    while (true) {
        console.log('Checking for jobs to process...');
        const jobs = yield prisma.executionQueue.findMany({
            where: { status: 'queued' },
        });
        for (const job of jobs) {
            try {
                console.log(`Processing job ID: ${job.id}`);
                const result = yield (0, CodeExecution_1.execCode)(job.languageID, job.sourceCode, job.stdin, job.timeout);
                yield prisma.executionQueue.update({
                    where: { id: job.id },
                    data: {
                        status: result.status,
                        stdout: result.stdout,
                        stderr: result.stderr,
                    },
                });
                console.log(`Job ${job.id} processed successfully.`);
            }
            catch (error) {
                console.error(`Error processing job ${job.id}:`, error);
                yield prisma.executionQueue.update({
                    where: { id: job.id },
                    data: { status: 'failed', stderr: error.message },
                });
            }
        }
        yield new Promise(resolve => setTimeout(resolve, 1000));
    }
});
processQueue().catch(error => console.error('Error in queue processor:', error));
