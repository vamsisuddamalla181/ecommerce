import { Request,Response } from "express";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { connectDB } from "./db/mongodb.ts";
import router from "./Routes/authroutes.ts";
import categoryrouter from "./Routes/categoryRoutes.ts";
import cookieparser from "cookie-parser";
const PORT=process.env.PORT||5000;
dotenv.config();
const app=express();
app.use(cookieparser())
app.use(helmet());
app.use(express.json());

app.use(express.urlencoded({extended:true}));

connectDB();

app.use("/",router)
app.use("/",categoryrouter)
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})