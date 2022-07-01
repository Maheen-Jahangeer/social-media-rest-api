import mongoose from "mongoose";
import Post from "../models/Post";
import User from "../models/User";

export const getAllProducts = async(userId) => {
    return new Promise(async(resolve,reject)=> {
        const user = await User.findById(userId)
        const userPosts = await Post.find({userId:user?.id})
        const followingPosts = user?.following?.map(async(friendsId) => {
            await Post.find({userId:friendsId})
        })
    })
}