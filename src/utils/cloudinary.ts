import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
 
config();
 
const requiredEnvVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});
 
// Verify connectivity on startup (non-blocking)
void cloudinary.api.ping()
  .then(() => {
    console.log(`Cloudinary connected (cloud: ${process.env.CLOUDINARY_CLOUD_NAME})`);
  })
  .catch((err) => {
    console.error("Cloudinary connection failed:", err?.message || err);
  });

export default cloudinary;
 