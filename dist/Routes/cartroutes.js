"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectedRoute_1 = require("../Middlewares/protectedRoute");
const cartcontroller_1 = require("../Controllers/cartcontroller");
const cartrouter = express_1.default.Router();
const { addToCart, getCart, updateCartItem, removeFromCart } = new cartcontroller_1.CartController();
cartrouter.get("/", protectedRoute_1.protectedRoute, getCart);
cartrouter.post("/", protectedRoute_1.protectedRoute, addToCart);
cartrouter.put("/", protectedRoute_1.protectedRoute, updateCartItem);
cartrouter.delete("/:productId", protectedRoute_1.protectedRoute, removeFromCart);
// cartrouter.delete("/clear", protectedRoute, clearCart);
exports.default = cartrouter;
