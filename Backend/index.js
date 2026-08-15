import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fileroute from "../Backend/Routes/file.route.js"
import mongoose from "mongoose"

dotenv.config()

const port = process.env.PORT || 4000

const app = express()
const URI = process.env.Mongodb_URI

app.use(express.json())
app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials:true
}))

try {
    mongoose.connect(URI)
    console.log("Mongodb connected")
} catch (error) {
    console.log("Not connecting to mongod error here")
    console.log(error)

}

app.use("/" , fileroute);

try {
    app.get("/",(req,res)=>{
        res.send("Server is running")
    })
} catch (error) {
    console.log("Error at index.js is " ,error)
}

app.listen(port , ()=>{
    console.log("Listening on Port" , port)
})
