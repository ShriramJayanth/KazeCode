"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubmission = exports.getSubmission = exports.makeSubmissions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const makeSubmissions = (req, res) => {
    res.send(req.body);
};
exports.makeSubmissions = makeSubmissions;
const getSubmission = (req, res) => {
    res.send(req.body);
};
exports.getSubmission = getSubmission;
const getAllSubmission = (req, res) => {
    res.send(prisma.submission.findMany());
};
exports.getAllSubmission = getAllSubmission;
