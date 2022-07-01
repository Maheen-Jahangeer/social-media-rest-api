import express,{Request, Response} from 'express';
import {response} from '../helpers/response'
import Post from '../models/Post';
import User from "../models/User";

const postRouter = express.Router();

//add post
postRouter.post('/add',async(req:Request,res:Response)=> {
    try{
        const newPost = new Post({
            userId:req.body.userId,
            desc:req.body.desc,
            image:req.body.image
        })
        const post = await newPost.save();
        res.status(200).json(post);
    }
    catch(e){
        res.status(401).send(response({
            status:'nok',
            error:{
                errorCode:'401',
                message:"Post can't add"
            }
        }))
    }
})

//update post
postRouter.put('/:id',async(req:Request,res:Response)=> {
    try{
       const updatedPost =  await Post.findByIdAndUpdate(req.params.id,{
            $set:req.body
        })
        res.status(200).json(updatedPost)
    }catch(e){
        res.status(400).send(response({
            status:'nok',
            error:{
                errorCode:'400',
                message:e.message
            }
        }))
    }
})

//delete post
postRouter.delete('/:id',async(req:Request,res:Response)=> {
    try{
        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        res.status(200).send(response({
            result:"deleted"
        }))
    }catch(e){
        res.status(400).send(response({
            status:'nok',
            error:{
                errorCode:"400",
                message:"User can't delete"
            }
        }))
    }
})

//get posts by id
postRouter.get('/:id',async (req,res)=> {
    try{
        const posts = await Post.findById(req.params.id)
        res.status(200).json(posts).send(response({
            result:"New posts"
        }))
    }catch(e){
        res.status(400).send(response({
            status:"nok",
            error:{
                errorCode:'400',
                message:e.message
            }
        }))
    }
})

//like post
postRouter.put('/:id/like', async(req,res)=> {
    try{
        const postTobeLiked = await Post.findById(req.params.id)
        if(!postTobeLiked?.likes?.includes(req.body.userId)){
        await postTobeLiked?.updateOne({$push:{likes:req.body.userId}})
        res.status(200).json(`post is liked by ${req.body.userId}`)}
        else{
            await postTobeLiked?.updateOne({$pull : {likes:req.body.userId}})
            res.status(200).json(`${req.body.userId} unliked the post`)
        }
    }catch(e){
        res.status(400).send(response({
            status:"nok",
            error:{
                errorCode:"400",
                message:e.message
            }
        }))
    }
})

//get timeline posts
postRouter.get('/timestamps/all', async(req,res)=> {
    try{
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({userId:currentUser?._id})
        const allPosts = await Post.find();
        const friendsPosts = currentUser?.following?.map((fridensId)=> {
            const newPost = allPosts.filter((post)=> {
             return  post.userId === fridensId
            })
            return newPost
        })
     res.status(200).json(userPosts.concat(...friendsPosts));
    }catch(e){
        res.status(400).send(response({
            status:"nok",
            error:{
                errorCode:'400',
                message:e.message
            }
        }))
    }
})

export default postRouter;