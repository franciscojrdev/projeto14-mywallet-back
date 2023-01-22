import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: ["com", "net"] })
      .required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    repeat_password: Joi.ref("password"),
  });