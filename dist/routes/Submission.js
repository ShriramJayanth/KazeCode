"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Submission_1 = require("../handlers/Submission");
const router = express_1.default.Router();
router.post("/submitCode", Submission_1.makeSubmissions);
router.post("/getSubmission", Submission_1.getSubmission);
exports.default = router;
