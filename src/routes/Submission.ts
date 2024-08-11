import express from "express"
import { makeSubmissions,getSubmission, getAllSubmission } from "../handlers/Submission"

const router=express.Router();

router.post("/submitCode",makeSubmissions)
router.get("/getSubmission",getSubmission)
router.get("/getAllSubmissions",getAllSubmission)

export default router