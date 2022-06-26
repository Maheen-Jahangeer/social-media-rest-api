import express, { Request, Response } from "express";
import User from '../models/User';

const authRouter = express.Router();

authRouter.post('/register', async (req: Request, res: Response) => {
    const newUser =new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const user = await newUser.save();
        res.status(200).send({
            status: "ok",
            result: user,
            error: {
                errorCode: '',
                message: ''
            }
        })
    } catch (e) {
        res.status(401).send({
            status: 'nok',
            error: {
                errorCode: '401',
                message: "Un Authorized"
            }
        })
    }
})

export default authRouter;