// src/routes/categoryRoutes.ts
import express from "express";
import { categorycontroller } from "../Controllers/categoryController";
import { authMiddleware } from "../Middlewares/adminmiddleware";
import { adminonly } from "../Middlewares/adminonly";

const categoryrouter = express.Router();
const categories=new categorycontroller()


categoryrouter.get("/get-all-category", categories.getCategories);

categoryrouter.post("/post-category", authMiddleware, adminonly, categories.createCategory);
categoryrouter.put("/update-catgeory/:id", authMiddleware, adminonly,categories.updateCategories );
categoryrouter.delete("/delete-category/:id", authMiddleware, adminonly,categories.deleteCategories );

export default categoryrouter;

