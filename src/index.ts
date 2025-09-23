import { Request,Response } from "express";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./db/mongodb";
import router from "./Routes/authroutes";
import categoryrouter from "./Routes/categoryRoutes";
import cookieparser from "cookie-parser";
import productrouter from "./Routes/productRoutes";
import cartrouter from "./Routes/cartroutes";
import orderRouter from "./Routes/orderroutes.js"; 
import reviewrouter from "./Routes/reviewRoutes.js";
const PORT=process.env.PORT||5000;
dotenv.config();
const app=express();
app.use(cookieparser())
app.use(helmet());
app.use(cors({
  origin: ["http://127.0.0.1:5500","http://127.0.0.1:65520","http://127.0.0.1:65013"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB()

app.use("/",router)
app.use("/",categoryrouter)
app.use("/api/products",productrouter)
app.use("/api/cart",cartrouter)
app.use("/api/orders",orderRouter)
app.use("/api/reviews",reviewrouter)
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})