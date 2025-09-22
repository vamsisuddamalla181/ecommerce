"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupvalidation = void 0;
const joi_1 = __importDefault(require("joi"));
const signupvalidation = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().max(35).required().messages({
            "string.empty": "Name is required",
            "string.max": "You exceeded the limit"
        }),
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Please enter email",
            "string.email": "Please enter a valid email"
        }),
        password: joi_1.default.string().min(5).regex(/[A-Z]/).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 5 characters",
            "string.pattern.base": "Password must contain at least one capital letter"
        }),
        role: joi_1.default.string().valid("user", "admin").default("user")
    });
    return schema.validate(data, { abortEarly: false });
};
exports.signupvalidation = signupvalidation;
