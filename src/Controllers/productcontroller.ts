import { Request, Response } from "express";
import { Product } from "../models/product";
import { AuthRequest } from "../Middlewares/adminmiddleware";
import cloudinary from "../utils/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";


export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    // Upload images to Cloudinary if provided
    if (files && files.length > 0) {
      const uploadFromBuffer = (fileBuffer: Buffer) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: process.env.CLOUDINARY_FOLDER || "uploads",
              resource_type: "image",
              quality: "auto",
              fetch_format: "auto",
              format: "webp"
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
              if (error) return reject(error);
              if (!result) return reject(new Error("Cloudinary upload failed"));
              resolve(result.secure_url);
            }
          );
          uploadStream.end(fileBuffer);
        });
      };

      const imageUrls = await Promise.all(files.map((f) => uploadFromBuffer(f.buffer)));
      (req.body as any).images = imageUrls;
    }

    // Coerce number fields (multer form-data gives strings)
    const body: any = {
      ...req.body,
    };
    if (body.price !== undefined) body.price = Number(body.price);
    if (body.discountedPrice !== undefined) body.discountedPrice = Number(body.discountedPrice);
    if (body.stock !== undefined) body.stock = Number(body.stock);

    // Basic validation to surface helpful errors
    const required = ["name", "description", "price", "discountedPrice", "stock", "category"];
    const missing = required.filter((k) => body[k] === undefined || body[k] === "");
    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query: any = {};
    if (category) query.category = category;

    const products = await Product.find(query);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "updated successfully", product });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }

};


export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
