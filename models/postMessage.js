import mongoose from "mongoose"
const Schema = mongoose.Schema

const postSchema = new Schema({
   title:{
       type:String,
       required:true
   },
   creator:{
       type:String
   },
   tags:{
    type:[String],
    required:true
   },
   message:{
       type:String,
       required:true
   },
   image:{
       type:String,
       required:true
   },
   likes:{
       type:[String],
       default:[]
   },
   user:{
       type:Schema.Types.ObjectId,
       ref:"User"
   }
},{timestamps:true})

const postModel = mongoose.model("Post",postSchema)

export default postModel