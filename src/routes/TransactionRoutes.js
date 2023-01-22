import { listTransactions,createTransactions } from "../controller/Transactions.js";
import { Router } from "express";


const transactionsRouter = Router()

transactionsRouter.get("/transacoes", listTransactions);

transactionsRouter.post("/transacoes", createTransactions);

export default transactionsRouter