import Joi from "joi";

export const createProductSchema = Joi.object({
  category: Joi.string().required(),
  barcode: Joi.string().allow(""),
  name: Joi.string().required(),
  importPrice: Joi.number().min(0).required().messages({
    "number.base": "Import price must be a number",
    "number.min": "Import price cannot be negative",
    "any.required": "Import price is required",
  }),

  sellPrice: Joi.number().greater(Joi.ref("importPrice")).required().messages({
    "number.base": "Sell price must be a number",
    "number.greater": "Sell price must be greater than import price",
    "any.required": "Sell price is required",
  }),

  stock: Joi.number().min(0).required(),

  warning_stock: Joi.number().default(0),
  unit: Joi.string().default("Cái"),
  image: Joi.string().allow(null),
  notice: Joi.string().allow(null),
});
