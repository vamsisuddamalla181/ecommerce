    import { NextFunction, Request,Response } from "express";
    export interface authrequest extends Request{
        user?:{
            id:string,
            role:string
        }
    }
    export const authorize=async(role:string[])=>{
        return (req:authrequest,res:Response,next:NextFunction)=>{
            if(!req.user){
                return res.status(404).json({message:"user not found"})
            }
            if(!req.user.role||!role.includes(req.user.role))
            {
                return res.status(400).json({message:"user role not found"})
            }
            next()
        }
    }