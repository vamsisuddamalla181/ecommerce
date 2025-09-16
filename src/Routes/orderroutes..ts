import express from "express";
import { protectedRoute, isAdmin } from "../Middlewares/protectedRoute";
import { OrderController } from "../Controllers/ordercontroller";

const orderRouter = express.Router();
const orderController = new OrderController();

// User routes (protected)
orderRouter.post("/", protectedRoute, orderController.createOrder);
orderRouter.get("/", protectedRoute, orderController.getUserOrders);
orderRouter.get("/:id", protectedRoute, orderController.getOrderById);
// orderRouter.post("/rate", protectedRoute, orderController.rateProduct);

// Admin routes (protected + admin only)
orderRouter.get("/admin/all", protectedRoute, isAdmin, orderController.getAllOrders);
orderRouter.put("/admin/:id", protectedRoute, isAdmin, orderController.updateOrderStatus);

export default orderRouter;
