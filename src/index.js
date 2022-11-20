import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import joi from "joi";

const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
  repeat_password : joi.ref('password')
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

app.post("/sign-up", async (req, res) => {
  const user = req.body;


  const { error } = userSchema.validate(user, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  const hashPassword = bcrypt.hashSync(user.password, 10);

  try {
    const emailExist = await userCollection.findOne({email: user.email});
    if(emailExist){
      return res.status(409).send("Email já existe");
    }
    await userCollection.insertOne({ ...user, password: hashPassword });
    res.sendStatus(201)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running in port:${process.env.PORT}`);
});
