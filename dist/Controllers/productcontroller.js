"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const product_1 = require("../models/product");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const createProduct = async (req, res) => {
    try {
        const files = req.files;
        // Upload images to Cloudinary if provided
        if (files && files.length > 0) {
            const uploadFromBuffer = (fileBuffer) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.default.uploader.upload_stream({
                        folder: process.env.CLOUDINARY_FOLDER || "uploads",
                        resource_type: "image",
                        quality: "auto",
                        fetch_format: "auto",
                        format: "webp"
                    }, (error, result) => {
                        if (error)
                            return reject(error);
                        if (!result)
                            return reject(new Error("Cloudinary upload failed"));
                        resolve(result.secure_url);
                    });
                    uploadStream.end(fileBuffer);
                });
            };
            const imageUrls = await Promise.all(files.map((f) => uploadFromBuffer(f.buffer)));
            req.body.images = imageUrls;
        }
        // Coerce number fields (multer form-data gives strings)
        const body = {
            ...req.body,
        };
        if (body.price !== undefined)
            body.price = Number(body.price);
        if (body.discountedPrice !== undefined)
            body.discountedPrice = Number(body.discountedPrice);
        if (body.stock !== undefined)
            body.stock = Number(body.stock);
        // Basic validation to surface helpful errors
        const required = ["name", "description", "price", "discountedPrice", "stock", "category"];
        const missing = required.filter((k) => body[k] === undefined || body[k] === "");
        if (missing.length) {
            return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
        }
        const product = await product_1.Product.create(body);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const query = {};
        if (category)
            query.category = category;
        const products = await product_1.Product.find(query);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const product = await product_1.Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const product = await product_1.Product.findByIdAndUpdate(req.params.id, req.body);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "updated successfully", product });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await product_1.Product.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await product_1.Product.find({ category });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductsByCategory = getProductsByCategory;
