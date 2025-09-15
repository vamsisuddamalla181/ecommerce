// controllers/productController.ts
import { Request, Response } from "express";
import { Product } from "../models/product";
import { AuthRequest } from "../Middlewares/adminmiddleware";

// Create Product
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.create({
      ...req.body,
      user: req.user!.id 
    });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products of Logged-in User
export const getUserProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ user: req.user!.id }).populate("user", "name email");;
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user!.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user!.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
