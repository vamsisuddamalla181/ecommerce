import { Request,Response } from "express";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { connectDB } from "./models/db/mongodb.ts";
const PORT=process.env.PORT||5000;
dotenv.config();
const app=express();
app.use(helmet());
app.use(express.json());

app.use(express.urlencoded({extended:true}));

connectDB();


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})