"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const orders_1 = require("../models/orders");
const Cart_1 = require("../models/Cart");
const product_1 = require("../models/product");
class OrderController {
    constructor() {
        // Create Order from Cart
        this.createOrder = async (req, res) => {
            try {
                const userId = req.user.id;
                const { shippingAddress } = req.body;
                const cart = await Cart_1.Cart.findOne({ userId }).populate("products.productId");
                console.log(cart);
                if (!cart || cart.products.length === 0) {
                    return res.status(400).json({ message: "Cart is empty" });
                }
                let totalAmount = 0;
                const products = cart.products.map((item) => {
                    const price = item.productId.discountedPrice || item.productId.price;
                    totalAmount += price * item.quantity;
                    return {
                        productId: item.productId._id,
                        quantity: item.quantity,
                        price,
                    };
                });
                const order = new orders_1.Order({
                    userId,
                    products,
                    totalAmount,
                    shippingAddress,
                });
                await order.save();
                cart.products = [];
                await cart.save();
                res.status(201).json({ message: "Order placed successfully", order });
            }
            catch (error) {
                res.status(500).json({ message: "Failed to create order", error: error.message });
            }
        };
        // Get all orders of logged-in user
        this.getUserOrders = async (req, res) => {
            try {
                const orders = await orders_1.Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to fetch user orders", error: error.message });
            }
        };
        // Get single order by ID
        this.getOrderById = async (req, res) => {
            try {
                const order = await orders_1.Order.findOne({
                    _id: req.params.id,
                    userId: req.user.id,
                });
                if (!order)
                    return res.status(404).json({ message: "Order not found" });
                res.json(order);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to fetch order", error: error.message });
            }
        };
        // Admin: Get all orders
        this.getAllOrders = async (req, res) => {
            try {
                if (req.user?.role !== "admin") {
                    return res.status(403).json({ message: "Access denied" });
                }
                const orders = await orders_1.Order.find().populate("userId", "name email");
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to fetch all orders", error: error.message });
            }
        };
        // Admin: Update order + payment status
        this.updateOrderStatus = async (req, res) => {
            try {
                if (req.user?.role !== "admin") {
                    return res.status(403).json({ message: "Access denied" });
                }
                const { orderStatus, paymentStatus } = req.body;
                const order = await orders_1.Order.findByIdAndUpdate(req.params.id, { orderStatus, paymentStatus }, { new: true });
                if (!order)
                    return res.status(404).json({ message: "Order not found" });
                res.json({ message: "Order updated successfully", order });
            }
            catch (error) {
                res.status(500).json({ message: "Failed to update order", error: error.message });
            }
        };
        // User: Rate product only after delivery
        this.rateProduct = async (req, res) => {
            try {
                const userId = req.user.id;
                const { productId, rating } = req.body;
                // Ensure order exists and product was delivered
                const order = await orders_1.Order.findOne({
                    userId,
                    "products.productId": productId,
                    orderStatus: "Delivered",
                });
                if (!order) {
                    return res.status(400).json({ message: "You can rate only after delivery" });
                }
                const product = await product_1.Product.findById(productId);
                if (!product)
                    return res.status(404).json({ message: "Product not found" });
                // ✅ Update rating calculation
                const existingRating = product.ratings?.[0];
                if (existingRating) {
                    const totalRatings = existingRating.numberOfRatings + 1;
                    const newAverage = (existingRating.averageRating * existingRating.numberOfRatings + rating) /
                        totalRatings;
                    product.ratings[0] = {
                        averageRating: newAverage,
                        numberOfRatings: totalRatings,
                    };
                }
                else {
                    product.ratings = [{ averageRating: rating, numberOfRatings: 1 }];
                }
                await product.save();
                res.json({ message: "Thanks for rating!", product });
            }
            catch (error) {
                res.status(500).json({ message: "Failed to rate product", error: error.message });
            }
        };
    }
}
exports.OrderController = OrderController;
