import mongoose  from "mongoose";

export const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3
    },
    email:{
        type:String,
        require:true,
        min:3,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:3
    },
    followers:{
        type:Array,
        require:true,
        default:[]
    },
    following:{
        type:Array,
        require:true,
        default:[]
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model("User", UserSchema)

