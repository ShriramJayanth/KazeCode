import express,{ Express,Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import sanitizeCode from "./CodeSanitize";

const prisma=new PrismaClient();

export const makeSubmissions=async(req:Request,res:Response)=>{

    const { languageID, sourceCode, stdin, timeout } = req.body;

    let checkCode:string=sanitizeCode(sourceCode);

    if(checkCode!=sourceCode){
      res.status(500).json({error:"forbidden code",details:checkCode});
    }

    try {
      const job = await prisma.executionQueue.create({
        data: {
          languageID,
          sourceCode,
          stdin,
          timeout,
        },
      });
      res.status(202).json({id:job.id});
    } catch (error) {
      res.status(500).json({ error: 'Failed to add job to the queue', details: error });
    }
}

export const getSubmission=async(req:Request,res:Response)=>{
        const  {id}  = req.params;
        console.log(id);
        try {
          const job = await prisma.executionQueue.findUnique({ where: { id:id } });
      
          if (!job) {
            return res.status(404).json({ error: 'Job not found' });
          }
      
          if (job.status === 'completed') {
            return res.status(200).json({
              status: job.status,
              stdout: job.stdout,
              stderr: job.stderr,
            });
          } else if (job.status === 'failed') {
            return res.status(200).json({
              status: job.status,
              stderr: "there is an error with the program. please debug it and submit",
            });
          } else {
            return res.status(200).json({ status: job.status });
          }
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch job status', details: error });
        }
    
}

