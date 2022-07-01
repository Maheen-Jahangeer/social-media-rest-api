import mongoose from "mongoose";

export const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
    },desc:{
        type:String,
        default:""
    },
    image:{
        type:String,
    },
    likes:{
        type:Array,
        default:[]
    }
},
{
    timestamps:true
})

export default mongoose.model("Post", PostSchema)