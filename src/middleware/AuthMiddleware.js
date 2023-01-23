import db from "../config/database.js";


export async function authValidation(req,res,next){
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.status(422).send("Informe o token!")

    try {
        const session = await db.collection("sessions").findOne({ token });

        if(!session){
            return res.status(401).send("Authorization Denied!")
        }
        res.locals.sessao = session

        next()
    } catch (error) {
        res.status(500).send(error)
    }
}