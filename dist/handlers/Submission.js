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
exports.getSubmission = exports.makeSubmissions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const makeSubmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { languageID, sourceCode, stdin, timeout } = req.body;
    try {
        const job = yield prisma.executionQueue.create({
            data: {
                languageID,
                sourceCode: Buffer.from(sourceCode, 'base64').toString('utf-8'),
                stdin,
                timeout,
            },
        });
        res.status(202).json({ id: job.id });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add job to the queue', details: error });
    }
});
exports.makeSubmissions = makeSubmissions;
const getSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    try {
        const job = yield prisma.executionQueue.findUnique({ where: { id: id } });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        if (job.status === 'completed') {
            return res.status(200).json({
                status: job.status,
                stdout: job.stdout,
                stderr: job.stderr,
            });
        }
        else if (job.status === 'failed') {
            return res.status(200).json({
                status: job.status,
                stderr: job.stderr,
            });
        }
        else {
            return res.status(200).json({ status: job.status });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch job status', details: error });
    }
});
exports.getSubmission = getSubmission;
