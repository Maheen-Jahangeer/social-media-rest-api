import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import cors from 'cors';
import userRouter from './routes/user';
import authRouter from "./routes/auth";

const app = express();
app.use(express.json());
dotenv.config();

//monogdb connection
mongoose.connect(process.env.MONGODB_URL,()=> {
    console.log("Database connected");
})

//routes
app.use('/user', userRouter);
app.use('/auth', authRouter)

//middlewares
app.use(helmet());
app.use(morgan());
app.use(cors())

//endpoints
app.get('/',(req,res)=> {
    res.send("welcome to new project")
})

//port connection
const port = process.env.PORT;
app.listen(port, ()=> {
    console.log(`listen to the port ${port}`)
})