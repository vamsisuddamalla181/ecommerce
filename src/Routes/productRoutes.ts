// routes/productRoutes.ts
import express from "express";
import { protectedRoute } from "../Middlewares/protectedRoute";
import { createProduct,
  getUserProducts,
  getProductById,
  updateProduct,
  deleteProduct, } from "../Controllers/productcontroller";
import { authMiddleware } from "../Middlewares/adminmiddleware";

const productrouter = express.Router();

productrouter.post("/", protectedRoute, createProduct);       // Add product
productrouter.get("/", protectedRoute, getUserProducts);      // Get all user products
productrouter.get("/:id", protectedRoute, getProductById);    // Get single product
productrouter.put("/:id", protectedRoute, updateProduct);     // Update product
productrouter.delete("/:id", protectedRoute, deleteProduct);  // Delete product

export default productrouter;
