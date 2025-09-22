"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/categoryRoutes.ts
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../Controllers/categoryController");
const adminmiddleware_1 = require("../Middlewares/adminmiddleware");
const adminonly_1 = require("../Middlewares/adminonly");
const protectedRoute_1 = require("../Middlewares/protectedRoute");
const categoryrouter = express_1.default.Router();
const categories = new categoryController_1.categorycontroller();
categoryrouter.get("/get-all-category", categories.getCategories);
categoryrouter.post("/post-category", protectedRoute_1.protectedRoute, adminmiddleware_1.authMiddleware, protectedRoute_1.isAdmin, categories.createCategory);
categoryrouter.put("/update-category/:id", protectedRoute_1.protectedRoute, adminmiddleware_1.authMiddleware, adminonly_1.adminonly, categories.updateCategories);
categoryrouter.delete("/delete-category/:id", protectedRoute_1.protectedRoute, adminmiddleware_1.authMiddleware, adminonly_1.adminonly, categories.deleteCategories);
exports.default = categoryrouter;
