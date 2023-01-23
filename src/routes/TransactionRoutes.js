import { listTransactions,createTransactions } from "../controller/Transactions.js";
import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema.js";
import { transactionSchema } from "../Model/TransactionSchema.js";


const transactionsRouter = Router()

transactionsRouter.get("/transacoes", listTransactions);

transactionsRouter.post("/transacoes",validateSchema(transactionSchema), createTransactions);

export default transactionsRouter