import { Request, Response } from "express";
import { Category } from "../models/Categories";
import { categoryValidation } from "../Validations/categoryvalidation";
import { updateCategoryValidation } from "../Validations/categoryvalidation";

export class categorycontroller {
    createCategory = async (req: Request, res: Response) => {
        const { error } = categoryValidation.validate(req.body, { abortEarly: false });
        if (error) 
            return res.status(400).json({ errors: error.details.map(d => d.message).join(", ") });

        try {
            const { name, description } = req.body;

            const exists = await Category.findOne({ name });
            if (exists) {
                return res.status(400).json({ message: "Category already exists" });
            }

            const category = new Category({ name, description });
            await category.save();

            res.status(201).json({ message: "Category created successfully", category });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err });
        }
    };

    getCategories = async (req: Request, res: Response) => {
        try {
            const categories = await Category.find().sort({ createdAt: -1 });
            res.json(categories);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err });
        }
    };

    updateCategories = async (req: Request, res: Response) => {
        try {
            const { error } =updateCategoryValidation.validate(req.body, { abortEarly: false })
            if (error) 
                return res.status(400).json({ errors: error.details.map(d => d.message).join(", ") });
            const {name,description}=req.body
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                { name, description }
            );

            if (!category) {
                res.status(404).json({message:"user not found"})
            }
            res.json({ message: "Category updated successfully", category });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err });
        }
    };

    deleteCategories = async (req: Request, res: Response) => {
        try {
            const deleteCategory = await Category.findByIdAndDelete(req.params.id)
            if (!deleteCategory) {
               return res.status(400).json({message:"user is not found"});
            }
            res.status(200).json({message:"user id deleted successfully",user:{name:deleteCategory.name,desciption:deleteCategory.description}})
        }
        catch (err) {
            res.status(500).json({ message: "Server error", error: err });
        }
    }
}