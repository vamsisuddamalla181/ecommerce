import express from "express";
import { protectedRoute } from "../Middlewares/protectedRoute";
import { CartController } from "../Controllers/cartcontroller";

const cartrouter = express.Router();
const { addToCart, getCart, updateCartItem, removeFromCart } = new CartController();

cartrouter.get("/", protectedRoute, getCart);
cartrouter.post("/", protectedRoute, addToCart);
cartrouter.put("/", protectedRoute, updateCartItem);
cartrouter.delete("/:productId", protectedRoute, removeFromCart);
// cartrouter.delete("/clear", protectedRoute, clearCart);

export default cartrouter;
