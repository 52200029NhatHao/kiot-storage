import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        sellPrice: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
  discount: Joi.number().min(0).required(),
});
