import express from "express"
import { makeSubmissions,getSubmission} from "../handlers/Submission"

const router=express.Router();

router.post("/submitCode",makeSubmissions)
router.get("/getSubmission",getSubmission)

export default router