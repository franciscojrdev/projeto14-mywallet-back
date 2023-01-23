import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../config/database.js";
// import { userSchema } from "../Model/AuthSchema.js";

export async function signUp(req, res) {
  const user = req.body;

  try {
    const findUser = await db
      .collection("users")
      .findOne({ email: user.email });
    if (findUser) {
      return res.status(409).send("Email indisponível!");
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    delete user.repeat_password;

    await db.collection("users").insertOne({
      ...user,
      password: passwordHash,
    });
    res.status(201).send({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });

    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();

      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      console.log(token);
      res.status(201).send({ token });
    } else {
      return res
        .status(400)
        .send({ message: "Usuário ou senha não encontrados" });
    }
  } catch (error) {
    res.sendStatus(500);
  }
}
