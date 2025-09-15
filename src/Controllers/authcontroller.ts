import { signupvalidation } from "../Validations/Signupvalidation";
import { Request, Response } from "express";
import { User } from "../models/Users";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { loginValidation } from "../Validations/Loginvalidation";
import { generateToken } from "../utils/generatetoken";

export class Authcontroller {
    signup = expressAsyncHandler(async (req: Request, res: Response) => {
        const { error } = signupvalidation(req.body);
        if (error) {
            const errormessage = error.details.map(detail => detail.message).join(", ");
            return res.status(400).json({ message: errormessage });
        }
        const { name, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newuser = new User({
            name,
            email,
            role,
            password: hashedpassword
        });
        await newuser.save();
        const token = generateToken(newuser.id);
        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newuser._id,
                name: newuser.name,
                email: newuser.email,
                role: newuser.role
            }
        });
    });

    login = expressAsyncHandler(async (req: Request, res: Response) => {
        const { error } = loginValidation(req.body);
        if (error) {
            const errormessage = error.details.map(d => d.message).join(", ");
            return res.status(400).json({ message: errormessage });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const ispassword = await bcrypt.compare(password, user.password);
        if (!ispassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user.id);
        return res.status(200).json({
            message: "User login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
}