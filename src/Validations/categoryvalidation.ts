import Joi from "joi";

export const categoryValidation = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 3 characters",
  }),
  description: Joi.string().min(10).max(200).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
  }),
});

export const updateCategoryValidation = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.min": "Category name must be at least 3 characters",
    "string.max": "Category name must not exceed 50 characters",
  }),
  description: Joi.string().min(10).max(200).optional().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description must not exceed 200 characters",
  }),
});
