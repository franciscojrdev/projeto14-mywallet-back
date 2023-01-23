import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/AuthRoutes.js";
import transactionsRouter from "./routes/TransactionRoutes.js";

//config
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use(authRouter)
app.use(transactionsRouter)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
