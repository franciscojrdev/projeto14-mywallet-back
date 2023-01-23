import db from "../config/database.js";
import dayjs from "dayjs";

export async function listTransactions(req, res) {
  
  const session = res.locals.sessao

  try {
    const userSession = await db
      .collection("users")
      .findOne({ _id: session.userId });

    delete userSession.password;

    const findTransactions = await db
      .collection("transactions")
      .find({ userId: userSession._id })
      .toArray();

    // console.log(findTransactions);

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
