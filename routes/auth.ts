import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import User from '../models/User';

const authRouter = express.Router();

//Register and save new user
authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const bcryptedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcryptedPassword
        })
        const user = await newUser.save();
        console.log('new user from', user)
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
                message: "Password failed"
            }
        })
    }
})

//Login user
authRouter.post('/login', async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email })
    !user && res.status(401).send({
        status: 'nok',
        error: {
            errorCode: '401',
            message: "This user is not available"
        }
    })
    try {
        const validPassword = await bcrypt.compare(req.body.password, user?.password)
        if (validPassword) {
            res.status(200).send({
                status: 'ok',
                result: user,
                error: {
                    errorCode: '',
                    message: ''
                }
            })
        }
        else {
            res.status(401).send({
                status: 'nok',
                error: {
                    errorCode: '401',
                    message: "Passport incorrect"
                }
            })
        }
    }
    catch (e) {
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