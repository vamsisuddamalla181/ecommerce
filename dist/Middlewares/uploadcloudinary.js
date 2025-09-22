"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const uploadToCloudinary = async (filePath, folder) => {
    const res = await cloudinary_1.default.uploader.upload(filePath, {
        folder: folder || process.env.CLOUDINARY_FOLDER || "uploads",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
        width: 1000,
        height: 1000,
        crop: "limit",
        format: "webp",
        transformation: [
            { flags: "lossy" },
            { quality: "auto:good" }
        ]
    });
    return { url: res.secure_url, publicId: res.public_id };
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    await cloudinary_1.default.uploader.destroy(publicId);
};
exports.deleteFromCloudinary = deleteFromCloudinary;
