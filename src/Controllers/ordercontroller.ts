import { Response } from "express";
import { Order } from "../models/orders";
import { Cart } from "../models/Cart";
import { AuthRequest } from "../Middlewares/adminmiddleware";
import { Product } from "../models/product";

export class OrderController {
  // Create Order from Cart
  createOrder = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { shippingAddress } = req.body;

      const cart = await Cart.findOne({ userId }).populate("products.productId");
      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      let totalAmount = 0;
      const products = cart.products.map((item: any) => {
        const price = item.productId.discountedPrice || item.productId.price;
        totalAmount += price * item.quantity;
        return {
          productId: item.productId._id,
          quantity: item.quantity,
          price,
        };
      });

      const order = new Order({
        userId,
        products,
        totalAmount,
        shippingAddress,
      });
      await order.save();

      cart.products = [];
      await cart.save();

      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get all orders of logged-in user
  getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
      const orders = await Order.find({ userId: req.user!.id }).sort({
        createdAt: -1,
      });
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get single order by ID
  getOrderById = async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        userId: req.user!.id,
      });
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Admin: Get all orders
  getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const orders = await Order.find().populate("userId", "name email");
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Admin: Update order + payment status
  updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { orderStatus, paymentStatus } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { orderStatus, paymentStatus },
        { new: true }
      );

      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json({ message: "Order updated successfully", order });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // User: Rate product only after delivery
  rateProduct = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { productId, rating } = req.body;

      const order = await Order.findOne({
        userId,
        "products.productId": productId,
        orderStatus: "Delivered",
      });

      if (!order) {
        return res
          .status(400)
          .json({ message: "You can rate only after delivery" });
      }

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const totalRatings = product.ratings.reduce(
        (sum, r) => sum + r.numberOfRatings,
        0
      );
      const totalScore = product.ratings.reduce(
        (sum, r) => sum + r.averageRating * r.numberOfRatings,
        0
      );

      const newTotal = totalRatings + 1;
      const newScore = totalScore + rating;

      product.ratings = [
        {
          averageRating: newScore / newTotal,
          numberOfRatings: newTotal,
        },
      ];

      await product.save();

      res.json({ message: "Thanks for rating!", product });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
