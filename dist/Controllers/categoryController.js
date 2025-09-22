"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorycontroller = void 0;
const Categories_1 = require("../models/Categories");
const categoryvalidation_1 = require("../Validations/categoryvalidation");
const categoryvalidation_2 = require("../Validations/categoryvalidation");
class categorycontroller {
    constructor() {
        this.createCategory = async (req, res) => {
            const { error } = categoryvalidation_1.categoryValidation.validate(req.body, { abortEarly: false });
            if (error)
                return res.status(400).json({ errors: error.details.map(d => d.message).join(", ") });
            try {
                const { name, description } = req.body;
                const exists = await Categories_1.Category.findOne({ name });
                if (exists) {
                    return res.status(400).json({ message: "Category already exists" });
                }
                const category = new Categories_1.Category({ name, description });
                await category.save();
                res.status(201).json({ message: "Category created successfully", category });
            }
            catch (err) {
                res.status(500).json({ message: "Server error", error: err });
            }
        };
        this.getCategories = async (req, res) => {
            try {
                const categories = await Categories_1.Category.find().sort({ createdAt: -1 });
                res.json(categories);
            }
            catch (err) {
                res.status(500).json({ message: "Server error", error: err });
            }
        };
        this.updateCategories = async (req, res) => {
            try {
                const { error } = categoryvalidation_2.updateCategoryValidation.validate(req.body, { abortEarly: false });
                if (error)
                    return res.status(400).json({ errors: error.details.map(d => d.message).join(", ") });
                const { name, description } = req.body;
                const category = await Categories_1.Category.findByIdAndUpdate(req.params.id, { name, description });
                if (!category) {
                    res.status(404).json({ message: "user not found" });
                }
                res.json({ message: "Category updated successfully", category });
            }
            catch (err) {
                res.status(500).json({ message: "Server error", error: err });
            }
        };
        this.deleteCategories = async (req, res) => {
            try {
                const deleteCategory = await Categories_1.Category.findByIdAndDelete(req.params.id);
                if (!deleteCategory) {
                    return res.status(400).json({ message: "user is not found" });
                }
                res.status(200).json({ message: "user id deleted successfully", user: { name: deleteCategory.name, desciption: deleteCategory.description } });
            }
            catch (err) {
                res.status(500).json({ message: "Server error", error: err });
            }
        };
    }
}
exports.categorycontroller = categorycontroller;
