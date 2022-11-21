import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import joi from "joi";
import dayjs from "dayjs";
import { v4 as uuidV4 } from "uuid";

const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
  repeat_password: joi.ref("password"),
});

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
  console.log("MondoDB Running");
} catch (err) {
  console.log(err);
}

const db = mongoClient.db("myWallet");
const userCollection = db.collection("users");
const accountCollection = db.collection("account");

app.post("/sign-up", async (req, res) => {
  const user = req.body;

  const { error } = userSchema.validate(user, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  const hashPassword = bcrypt.hashSync(user.password, 10);

  try {
    const emailExist = await userCollection.findOne({ email: user.email });
    if (emailExist) {
      return res.status(409).send("Email já existe");
    }
    await userCollection.insertOne({
      ...user,
      password: hashPassword,
      repeat_password: hashPassword,
    });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const token = uuidV4();
  console.log(token);

  try {
    const userExist = await userCollection.findOne({ email });
    if (!userExist) {
      return res.sendStatus(401);
    }

    const compairPassword = bcrypt.compareSync(password, userExist.password);

    if (!compairPassword) {
      return res.sendStatus(401);
    }

    await db.collection("sessions").insertOne({
      token,
      userId: userExist._id,
    });

    res.send({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(401);
  }
});

app.get("/home", async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Token Invalid");
  }
  try {
    const session = await db.collection("sessions").findOne({ token });

    const user = await userCollection.findOne({ _id: session?.userId });

    
    console.log(accounts)
    
    if (!user) {
      return res.sendStatus(401);
    }
    // const accounts = await accountCollection.find({userId:user?._id});
    
    delete user.password;
    delete user.repeat_password;

    res.send({ user });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/new-entry", async (req, res) => {
  const { token, saque, values, descripition } = req.body;

  try {
    const session = await db.collection("sessions").findOne({ token });

    const user = await db.collection("sessions").findOne({_id : session?.userId});

    await accountCollection.insertOne({
      userId: user?.userId,
      saque,
      values,
      descripition,
      day: dayjs().format('DD/MM')
    })
    res.sendStatus(201)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running in port:${process.env.PORT}`);
});
