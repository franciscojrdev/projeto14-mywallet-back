import db from "../config/database.js";
import dayjs from "dayjs";
// import { transactionSchema } from "../Model/TransactionSchema.js";

export async function listTransactions(req, res) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    console.log("aqui", session);

    if (!session || !token) {
      return res.sendStatus(401);
    }
    const userSession = await db
      .collection("users")
      .findOne({ _id: session.userId });
    console.log(userSession);
    //se for apagar a senha ao enviar para o usuário
    delete userSession.password;

    const findTransactions = await db
      .collection("transactions")
      .find({ userId: userSession._id })
      .toArray();

    console.log(findTransactions);

    res
      .status(201)
      .send({ user: { ...userSession }, list: [...findTransactions] });
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function createTransactions(req, res) {
  const { token, description, valor, status } = req.body;

  try {
    const findId = await db.collection("sessions").findOne({ token: token });
    console.log(findId);

    if (!findId) {
      return res.sendStatus(401);
    }
    await db.collection("transactions").insertOne({
      day: dayjs().format("DD/MM"),
      description: description,
      valor: valor,
      status: status,
      userId: findId.userId,
    });
    res.status(201).send("ok");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
