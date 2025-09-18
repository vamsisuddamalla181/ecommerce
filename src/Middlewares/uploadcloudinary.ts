import { config } from "dotenv";
config();
import cloudinary from "../utils/cloudinary";
 
export const uploadToCloudinary = async (filePath: string, folder?: string) => {
  const res = await cloudinary.uploader.upload(filePath, {
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
 
export const deleteFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};