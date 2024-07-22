import Joi from "joi";

export const createAuthSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be provided",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be provided",
  }),
});
