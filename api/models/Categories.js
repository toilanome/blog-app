import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        defaultValue : "UnCategorized"
    },
    
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
},
{
    timestamps:true, versionKey:false
});
 // tìm category đã tồn tại. nếu không tồn tại sẽ tạo category mới
categorySchema.statics.findOrCreate = async function findOrCreate({ name }) {
    try {
        let category = await this.findOne({ name });

        if (!category) {
            category = await this.create({ name });
        }

        return category;
    } catch (error) {
        throw new Error(`Error in findOrCreate: ${error.message}`);
    }
};
//Export the model
export default mongoose.model('Category', categorySchema);