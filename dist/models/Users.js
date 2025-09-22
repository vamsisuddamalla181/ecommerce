"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: [{
            phone: { type: Number, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: Number, min: 6, max: 6, required: true },
        }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
