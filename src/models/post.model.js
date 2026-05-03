const mongoose=require("mongoose")



const postSchema=new mongoose.Schema({
    caption:{
        type:String,
        default:""

    },
    imgUrl:
    {
        type:String,
        required:[true,"img_url is required for creating "]
    },
    // this is the refrenceing variable that shows that the data of which user and attributes of the specific user
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"user id is required for creating the post"]
    }
    
})
const postModel=mongoose.model("posts",postSchema)
module.exports=postModel