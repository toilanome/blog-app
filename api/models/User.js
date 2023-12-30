import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    avatar: {
        type: String,
        default:""
    },
},
{ timestamps:true,versionKey: false })

export default mongoose.model('User',userSchema)