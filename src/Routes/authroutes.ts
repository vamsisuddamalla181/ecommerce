import { Authcontroller } from "../Controllers/authcontroller";
import express from "express"
const router=express.Router()
const authcontroller=new Authcontroller()
router.post("/signup",authcontroller.signup)
router.get("/login",authcontroller.login)
router.get("/logout",authcontroller.logout)

export default router;