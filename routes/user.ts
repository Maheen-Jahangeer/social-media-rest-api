import express from "express";

const userRouter  = express.Router();

userRouter.get('/', (req,res)=> {
    res.send("New welcome for the user")
})

export default userRouter;