import { Authcontroller } from "../Controllers/authcontroller";
import { authorize } from "../Middlewares/rolemiddleware";
import express from "express"
const router=express.Router()
const authcontroller=new Authcontroller()
router.post("/signup",authcontroller.signup)
router.get("/login",authcontroller.login)

export default router;