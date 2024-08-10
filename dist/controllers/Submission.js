"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubmission = exports.makeSubmissions = void 0;
const makeSubmissions = (req, res) => {
    res.send(req.body);
};
exports.makeSubmissions = makeSubmissions;
const getSubmission = (req, res) => {
    res.send(req.body);
};
exports.getSubmission = getSubmission;
