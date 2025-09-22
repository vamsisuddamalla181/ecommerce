"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const requiredEnvVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
// Verify connectivity on startup (non-blocking)
void cloudinary_1.v2.api.ping()
    .then(() => {
    console.log(`Cloudinary connected (cloud: ${process.env.CLOUDINARY_CLOUD_NAME})`);
})
    .catch((err) => {
    console.error("Cloudinary connection failed:", err?.message || err);
});
exports.default = cloudinary_1.v2;
