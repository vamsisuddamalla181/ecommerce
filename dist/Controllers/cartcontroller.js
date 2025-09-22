"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const Cart_1 = require("../models/Cart");
const product_1 = require("../models/product");
class CartController {
    constructor() {
        // Add product to cart
        this.addToCart = async (req, res) => {
            try {
                const { productId, quantity } = req.body;
                const userId = req.user?.id;
                // Fetch product details
                const product = await product_1.Product.findById(productId);
                if (!product)
                    return res.status(404).json({ message: "Product not found" });
                let cart = await Cart_1.Cart.findOne({ userId });
                if (!cart) {
                    cart = new Cart_1.Cart({
                        userId,
                        products: [{
                                productId,
                                quantity,
                                name: product.name,
                                price: product.price
                            }]
                    });
                }
                else {
                    const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
                    if (existingProduct) {
                        existingProduct.quantity += quantity;
                        existingProduct.name = product.name;
                        existingProduct.price = product.price;
                    }
                    else {
                        cart.products.push({
                            productId,
                            quantity,
                            name: product.name,
                            price: product.price
                        });
                    }
                }
                await cart.save();
                res.status(200).json({ message: "Product added to cart", cart });
            }
            catch (err) {
                res.status(500).json({ message: "Server error", error: err.message || err });
            }
        };
        // Get cart
        this.getCart = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId)
                    return res.status(401).json({ message: "Unauthorized" });
                const cart = await Cart_1.Cart.findOne({ userId });
                res.json(cart || { products: [] });
            }
            catch (err) {
                res.status(500).json({ message: "Server error", error: err.message });
            }
        };
        // Update quantity
        this.updateCartItem = async (req, res) => {
            try {
                const { productId, quantity } = req.body;
                const userId = req.user?.id;
                const cart = await Cart_1.Cart.findOne({ userId });
                if (!cart)
                    return res.status(404).json({ message: "Cart not found" });
                const product = await product_1.Product.findById(productId);
                if (!product)
                    return res.status(404).json({ message: "Product not found" });
                const item = cart.products.find((p) => p.productId.toString() === productId);
                if (!item)
                    return res.status(404).json({ message: "Product not in cart" });
                item.quantity = quantity;
                item.name = product.name; // Update name
                item.price = product.price; // Update price
                await cart.save();
                res.json({ message: "Cart updated", cart });
            }
            catch (err) {
                res.status(500).json({ message: "Server error", error: err.message || err });
            }
        };
        // Remove product
        this.removeFromCart = async (req, res) => {
            try {
                const { productId } = req.params;
                const userId = req.user?.id;
                if (!productId)
                    return res.status(400).json({ message: "Product ID is required" });
                const cart = await Cart_1.Cart.findOne({ userId });
                if (!cart)
                    return res.status(404).json({ message: "Cart not found" });
                cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
                await cart.save();
                res.json({ message: "Product removed", cart });
            }
            catch (err) {
                res.status(500).json({ message: "Server error", error: err.message || err });
            }
        };
    }
}
exports.CartController = CartController;
// import { populate } from 'dotenv';
// import {model, Schema, Document,Types} from 'mongoose';
// export interface ICart extends Document {
//     userId: Types.ObjectId;
//     products: {
//         productId: Types.ObjectId;
//         quantity: number;
//     }[];
//     createdAt: Date;
//     updatedAt: Date;
// }
// const cartSchema = new Schema<ICart>({
//     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//     products: [{   
//         productId: { type: Schema.Types.ObjectId, ref: 'product',populate:true, required: true },
//         quantity: { type: Number, required: true, min: 1 },
//     }],
// }, { timestamps: true }); 
// export const Cart = model<ICart>('Cart', cartSchema);
// import { Request, Response } from "express";
// import { Cart } from "../models/Cart";
// import { AuthRequest } from "../Middlewares/adminmiddleware";
// export class CartController {
//     // Add product to cart
//     addToCart = async (req: AuthRequest, res: Response) => {
//         try {
//             const { productId, quantity } = req.body;
//             const userId = req.user?.id; // from auth middleware
//             let cart = await Cart.findOne({ userId }).populate({
//                 path: "products.productId",
//                 select: "name price description", 
//             });
//             if (!cart) {
//                 cart = new Cart({ userId, products: [{ productId, quantity }] });
//             } else {
//                 const existingProduct = cart.products.find(
//                     (p) => p.productId.toString() === productId
//                 );
//                 if (existingProduct) {
//                     existingProduct.quantity += quantity;
//                 } else {
//                     cart.products.push({ productId, quantity });
//                 }
//             }
//             await cart.save();
//             res.status(200).json({ message: "Product added to cart", cart });
//         } catch (err: any) {
//             res.status(500).json({ message: "Server error", error: err.message || err });
//         }
//     };
//     // Get cart
//     getCart = async (req: AuthRequest, res: Response) => {
//         try {
//             const userId = req.user?.id;
//             if (!userId) return res.status(401).json({ message: "Unauthorized" });
//             const cart = await Cart.findOne({ userId }).populate("products.productId");
//             res.json(cart || { products: [] });
//         } catch (err: any) {
//             res.status(500).json({ message: "Server error", error: err.message });
//         }
//     };
//     // Update quantity
//     updateCartItem = async (req: AuthRequest, res: Response) => {
//         try {
//             const { productId, quantity } = req.body;
//             const userId = req.user?.id;
//             const cart = await Cart.findOne({ userId });
//             if (!cart) return res.status(404).json({ message: "Cart not found" });
//             const item = cart.products.find(
//                 (p) => p.productId.toString() === productId
//             );
//             if (!item) return res.status(404).json({ message: "Product not in cart" });
//             item.quantity = quantity;
//             await cart.save();
//             res.json({ message: "Cart updated", cart });
//         } catch (err: any) {
//             res.status(500).json({ message: "Server error", error: err.message || err });
//         }
//     };
//     // Remove product
//     removeFromCart = async (req: AuthRequest, res: Response) => {
//         try {
//             const { productId } = req.params;
//             const userId = req.user?.id;
//             if (!productId) {
//                 return res.status(400).json({ message: "Product ID is required" });
//             }
//             const cart = await Cart.findOne({ userId });
//             if (!cart)
//                 return res.status(404).json({ message: "Cart not found" });
//             cart.products = cart.products.filter(
//                 (p) => p.productId.toString() !== productId
//             );
//             await cart.save();
//             res.json({ message: "Product removed", cart });
//         } catch (err: any) {
//             res.status(500).json({ message: "Server error", error: err.message || err });
//         }
//     };
// }
