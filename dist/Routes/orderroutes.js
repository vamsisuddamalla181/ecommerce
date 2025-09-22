"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectedRoute_1 = require("../Middlewares/protectedRoute");
const ordercontroller_1 = require("../Controllers/ordercontroller");
const orderRouter = express_1.default.Router();
const orderController = new ordercontroller_1.OrderController();
// User routes (protected)
orderRouter.post("/", protectedRoute_1.protectedRoute, orderController.createOrder);
orderRouter.get("/", protectedRoute_1.protectedRoute, orderController.getUserOrders);
orderRouter.get("/:id", protectedRoute_1.protectedRoute, orderController.getOrderById);
// orderRouter.post("/rate", protectedRoute, orderController.rateProduct);
// Admin routes (protected + admin only)
orderRouter.get("/admin/all", protectedRoute_1.protectedRoute, protectedRoute_1.isAdmin, orderController.getAllOrders);
orderRouter.put("/admin/:id", protectedRoute_1.protectedRoute, protectedRoute_1.isAdmin, orderController.updateOrderStatus);
exports.default = orderRouter;
