import express,{ Express,Request,Response } from "express";

export const makeSubmissions=(req:Request,res:Response)=>{
    res.send(req.body);
}

export const getSubmission=(req:Request,res:Response)=>{
    res.send(req.body);
}

export const getAllSubmission=(req:Request,res:Response)=>{
    res.send(req.body);
}