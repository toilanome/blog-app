import mongoose, { Schema } from "mongoose";

 const postSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    summary: String,
    content:String,
    cover:String,
    author: {type:Schema.Types.ObjectId, ref:'User'},
    category:
    {
        type:mongoose.Types.ObjectId,
        // ref dùng để liên kết bảng
        ref: "Category",
    },
    comments:[
        {
            type:mongoose.Types.ObjectId,
            // ref dùng để liên kết bảng
            ref: "Comments",
        }
    ]
   
},
{ timestamps:true })



export default mongoose.model('Post',postSchema)