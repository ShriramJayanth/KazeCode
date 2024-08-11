import express,{ Express,Request,Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();

export const makeSubmissions=(req:Request,res:Response)=>{
    res.send(req.body);
}

export const getSubmission=(req:Request,res:Response)=>{
    res.send(req.body);
}