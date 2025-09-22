"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryValidation = exports.categoryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.categoryValidation = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).required().messages({
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 3 characters",
    }),
    description: joi_1.default.string().min(10).max(200).required().messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 10 characters",
    }),
});
exports.updateCategoryValidation = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).optional().messages({
        "string.min": "Category name must be at least 3 characters",
        "string.max": "Category name must not exceed 50 characters",
    }),
    description: joi_1.default.string().min(10).max(200).optional().messages({
        "string.min": "Description must be at least 10 characters",
        "string.max": "Description must not exceed 200 characters",
    }),
});
