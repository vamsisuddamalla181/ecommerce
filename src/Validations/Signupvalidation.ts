import joi from "joi";
export const signupvalidation=(data:any)=>{
     const schema = joi.object({
        name: joi.string().max(35).required().messages({
            "string.empty": "Name is required",
            "string.max": "You exceeded the limit"
        }),
        email: joi.string().email().required().messages({
            "string.empty": "Please enter email",
            "string.email": "Please enter a valid email"
        }),
        password: joi.string().min(5).regex(/[A-Z]/).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 5 characters",
            "string.pattern.base": "Password must contain at least one capital letter"
        }),
        role: joi.string().valid("user", "admin").default("user") 
    });
    return schema.validate(data, { abortEarly: false });
};
