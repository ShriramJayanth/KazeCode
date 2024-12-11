import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import SubmissionRoutes from "./routes/Submission"
import cors from "cors";
import "./handlers/queueProcess";

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use(cors({
  credentials: true,
  origin: "*",
}));

app.use("/submit", SubmissionRoutes)

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`)
})
