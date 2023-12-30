import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema({

    comment:{
        type:String,
        required: true
    },
    users:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ,
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ],
    userName : String,
    avatar : String
},
{
    timestamps:true, versionKey:false
});

//Export the model
export default mongoose.model('Comments', commentSchema);