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
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newuser = new User({
            name,
            email,
            password: hashedpassword
        });
        await newuser.save();
        res.status(200).json({ message: "User created successfully", user: newuser });
    });

    login = expressAsyncHandler(async (req: Request, res: Response) => {
        const { error } = loginValidation(req.body);
        if (error) {
            const errormessage = error.details.map(detail => detail.message).join(", ");
            return res.status(400).json({ message: errormessage });
        }
        const { email, password } = req.body;
        const exists = await User.findOne({ email });
        if (!exists) {
            return res.status(404).json({ message: "User not found" });
        }
        const ispassword = await bcrypt.compare(password, exists.password);
        if (!ispassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(exists);
        res.json({ token, role: exists.role });
        res.status(200).json({
            message: "User login successful",
            user: {
                id: exists._id,
                name: exists.name,
                email: exists.email,
                role: exists.role
            }
        });
    });
}