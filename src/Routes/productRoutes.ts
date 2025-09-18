import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from "../Controllers/productcontroller";
import { protectedRoute } from "../Middlewares/protectedRoute";
import { uploadMany } from "../utils/multer";

const productRouter = express.Router();

productRouter.post("/", protectedRoute,uploadMany, createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", protectedRoute, updateProduct);
productRouter.delete("/:id", protectedRoute, deleteProduct);
productRouter.get("/category/:category", getProductsByCategory);

export default productRouter;
