import express from "express"
import { makeSubmissions,getSubmission} from "../handlers/Submission"

const router=express.Router();

router.post("/submitCode",makeSubmissions)
router.get("/getSubmission/:id",getSubmission)

export default router