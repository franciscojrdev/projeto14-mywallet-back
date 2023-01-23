import Joi from "joi";

export const transactionSchema = Joi.object({
    token: Joi.string(),
    description: Joi.string().min(3).required(),
    valor: Joi.number().required(),
    status: Joi.string().required().valid("entrada", "saida"),
  });
