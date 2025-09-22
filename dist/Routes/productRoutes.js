"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productcontroller_1 = require("../Controllers/productcontroller");
const protectedRoute_1 = require("../Middlewares/protectedRoute");
const multer_1 = require("../utils/multer");
const productRouter = express_1.default.Router();
productRouter.post("/", protectedRoute_1.protectedRoute, multer_1.uploadMany, productcontroller_1.createProduct);
productRouter.get("/", productcontroller_1.getAllProducts);
productRouter.get("/:id", productcontroller_1.getProductById);
productRouter.put("/:id", protectedRoute_1.protectedRoute, productcontroller_1.updateProduct);
productRouter.delete("/:id", protectedRoute_1.protectedRoute, productcontroller_1.deleteProduct);
productRouter.get("/category/:category", productcontroller_1.getProductsByCategory);
exports.default = productRouter;
