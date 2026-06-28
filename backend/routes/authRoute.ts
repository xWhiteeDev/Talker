import express from "express";

export const authRouter = express.Router()


authRouter.post('/register',(req,res)=>{
    console.log(req.body)
    console.log('Register post')
    //todo
})