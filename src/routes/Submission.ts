import express from "express"
import { makeSubmissions,getSubmission } from "../controllers/Submission"

const router=express.Router();

router.post("/submitCode",makeSubmissions)
router.get("/getSubmission",getSubmission)

export default router