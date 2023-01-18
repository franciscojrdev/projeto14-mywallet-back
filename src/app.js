import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import dotenv from 'dotenv'
import Joi from 'joi'
import Joi from 'joi'


//config
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db

try {
    await mongoClient.connect()
    db = mongoClient.db()
} catch (error) {
    console.log(error.message)
}


const userSchema 
 = Joi.object()


app.post("/sign-up", async(req,res) => {
    const user = req.body;

    const {error} = userSchema.validate(user,{abortEarly:false})

    if(error){
        const erros = error.details.map(detail => detail.message)
        res.status(400).send(erros)
    }
    try {
        
    } catch (error) {
        
    }
})



app.listen(5000,()=>{
    console.log("Server running in port 5000")
})