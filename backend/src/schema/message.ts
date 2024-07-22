import Joi from "joi";

export const messageBodySchema = Joi.object({
  content: Joi.string().required().messages({
    "any.required": "content is required",
  }),
}).options({
  stripUnknown: true,
});
