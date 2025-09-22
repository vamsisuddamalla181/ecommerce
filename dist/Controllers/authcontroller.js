"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authcontroller = void 0;
const Signupvalidation_1 = require("../Validations/Signupvalidation");
const Users_1 = require("../models/Users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Loginvalidation_1 = require("../Validations/Loginvalidation");
const generatetoken_1 = require("../utils/generatetoken");
class Authcontroller {
    constructor() {
        this.signup = (async (req, res) => {
            const { error } = await (0, Signupvalidation_1.signupvalidation)(req.body);
            if (error) {
                const errormessage = error.details.map(detail => detail.message).join(", ");
                return res.status(400).json({ message: errormessage });
            }
            const { name, email, password, role } = req.body;
            const exists = await Users_1.User.findOne({ email });
            if (exists) {
                return res.status(400).json({ message: "User already exists" });
            }
            const hashedpassword = await bcrypt_1.default.hash(password, 10);
            const newuser = new Users_1.User({
                name,
                email,
                role,
                password: hashedpassword
            });
            await newuser.save();
            const token = (0, generatetoken_1.generateToken)(newuser);
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
        this.login = (async (req, res) => {
            const { error } = await (0, Loginvalidation_1.loginValidation)(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { email, password } = req.body;
            const user = await Users_1.User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const ispassword = await bcrypt_1.default.compare(password, user.password);
            if (!ispassword) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            const token = (0, generatetoken_1.generateToken)(user);
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
        this.logout = (req, res) => {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            return res.status(200).json({
                message: "User logged out successfully"
            });
        };
    }
}
exports.Authcontroller = Authcontroller;
