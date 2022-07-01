import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { response } from "../helpers/response";
import {ObjectID, ObjectId} from 'mongodb'
import { isObjectIdOrHexString } from "mongoose";

const userRouter  = express.Router();

//update user
userRouter.put('/:id',async(req,res)=> {
    if(req.body.userId === (req.params.id) || req.body.isAdmin){
        if(req.body.password){
            try{
                const hashedPassword = await bcrypt.hash(req.body.password,10)
                req.body.password = hashedPassword
            }catch(e){
                res.status(400).send(response({
                    status:'nok',
                    error:{
                        errorCode:'400',
                        message:"Password hashing is failed"
                    }
                }))
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            })
            res.status(200).send(response({
                result:JSON.stringify(user)
            }))
        }catch(e){
            res.status(400).send({
                error:{
                    errorCode:'400',
                    message:"Failed"
                }
            })
        }
    }else{
        res.status(400).send(response({
            status:'nok',
            error:{
                errorCode:'401',
                message:"User can only it's own data"
            }
        }))
    }
})

//delete a user
userRouter.delete('/:id',async(req,res)=> {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try{
            const user = await User.findByIdAndDelete(req.params.id,{
                $set:req.body
            })
            res.status(200).send(response({
                result:JSON.stringify(user)
            }))
        }catch(e){
            res.status(400).send({
                error:{
                    errorCode:'400',
                    message:"Failed deletion action"
                }
            })
        }
    }
    else{
        res.status(401).send(response({
            status:'nok',
            error:{
                errorCode:'401',
                message:'User can only delete'
            }
        }))
    }
})

//get user 
userRouter.get('/:id', async (req,res)=> {
    try{
        const user = await User.findById(req.params.id)
        const responsUserData = {
            username:user?.username,
            email:user?.email,
            followers:user?.followers,
            following:user?.following
        }
        res.status(200).json(responsUserData)
    }catch(e){
        res.status(400).send(response({
            status:'nok',
            error:{
                errorCode:'401',
                message:"Failed"
            }
        }))
    }
})

//follow user
userRouter.put('/:id/follow',async(req,res)=> {
    if(req.body.userId !== req.params.id){
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        if(!currentUser?.followers?.includes(user?.id)){
            await currentUser?.updateOne({$push:{followers: new ObjectId(req.params.id).toHexString()}})
            await user?.updateOne({$push:{following:req.body.userId}})
            res.status(200).json(currentUser);
        }else{
            res.send(response({
                status:'nok',
                error:{
                    errorCode:'401',
                    message:'This user already a follower'
                }
            }))
        }
    }else{ 
        res.status(400).send(response({
            status:"nok",
            error:{
                errorCode:'401',
                message:"User can not follow themeselvess"
            }
        }))
    }
})

//unfollow user
userRouter.put('/:id/unfollow',async(req,res)=> {
    if(req.body.userId !== req.params.id){
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.id)
        if(currentUser?.followers?.includes(req.params.id)){
            await currentUser.updateOne({$pull:{followers:req.params.id}})
            await user?.updateOne({$pull:{following:req.body.userId}})
            res.status(200).json(user)
        }else{
            res.status(401).send(response({
                status:'nok',
                error:{
                    errorCode:'401',
                    message:'Can only unfollow if you follow this person'
                }
            }))
        }
    }else{
        res.status(401).send(response({
            status:'nok',
            error:{
                errorCode:"401",
                message:`user can't unfollow themeselvess`
            }
        }))
    }
})


export default userRouter;