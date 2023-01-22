import Joi from "joi";

export const transactionSchema = Joi.object({
    description: Joi.string().min(3).required(),
    valor: Joi.number().required(),
    status: Joi.string().required().valid("entrada", "saida"),
  });
