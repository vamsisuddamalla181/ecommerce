import joi from "joi"
export const loginValidation = async (data: any) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email",
        }),
        password: joi.string().required().messages({
            "string.empty": "Password is required",
        }),
    });
    return schema.validate(data,{abortEarly:false})
}

