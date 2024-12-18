"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Submission_1 = __importDefault(require("./routes/Submission"));
const cors_1 = __importDefault(require("cors"));
require("./handlers/queueProcess");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "*",
}));
app.use("/submit", Submission_1.default);
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
});
