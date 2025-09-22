"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("./db/mongodb");
const authroutes_1 = __importDefault(require("./Routes/authroutes"));
const categoryRoutes_1 = __importDefault(require("./Routes/categoryRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const productRoutes_1 = __importDefault(require("./Routes/productRoutes"));
const cartroutes_1 = __importDefault(require("./Routes/cartroutes"));
const orderroutes_js_1 = __importDefault(require("./Routes/orderroutes.js"));
const PORT = process.env.PORT || 5000;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://127.0.0.1:5500", "http://127.0.0.1:65520", "http://127.0.0.1:61973"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, mongodb_1.connectDB)();
app.use("/", authroutes_1.default);
app.use("/", categoryRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartroutes_1.default);
app.use("/api/orders", orderroutes_js_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
