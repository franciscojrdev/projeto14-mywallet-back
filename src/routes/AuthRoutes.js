import { signUp,signIn } from "../controller/Auth.js";
import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema.js";
import { userSchema } from "../Model/AuthSchema.js";

const authRouter = Router()

authRouter.post("/sign-up",validateSchema(userSchema),signUp);

authRouter.post("/sign-in", signIn);

export default authRouter