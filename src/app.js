import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import Joi, { string } from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

//config
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db();
} catch (error) {
  console.log(error.message);
}

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: ["com", "net"] })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  repeat_password: Joi.ref("password"),
});

//criar o bcrypt e adicionar no banco de dados

app.post("/sign-up", async (req, res) => {
  const user = req.body;

  const { error } = userSchema.validate(user, { abortEarly: false });

  console.log(error);

  if (error) {
    const erros = error.details.map((detail) => detail.message);
    res.status(400).send(erros);
  }
  try {
    const passwordHash = bcrypt.hashSync(user.password, 10);

    await db
      .collection("users")
      .insertOne({
        ...user,
        password: passwordHash,
        repeat_password: passwordHash,
      });
    res.status(201).send({message:"Usuário criado com sucesso!"})
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db.collection("users").findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();

      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      res.status(201).send(token);
    } else {
      return res
        .status(400)
        .send({ message: "Usuário ou senha não encontrados" });
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/gastos", async(req,res)=>{
    const {authorization} = req.headers

    const token = authorization.replace("Bearer ","")

    try {

        const findUser = await db.collection("sessions").findOne({token})
        
        
        
        
    } catch (error) {
        res.sendStatus(500)
    }
})

app.listen(5000, () => {
  console.log("Server running in port 5000");
});
