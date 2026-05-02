const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"User name already require"],
        required:[true,"User name is required"],
    },
    email:{
        type:String,
        unique:[true,"Email already exists"],
        required:[true,"Email is required "]
    },
    password:{
        type:String,
        required:[true,"password is required "]
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/tp2jzeqro/cropped_circle_image.png?updatedAt=1777397323046"
    }

    
},
{
    timestamps:true
});
const userModel=mongoose.model("users",userSchema)
module.exports=userModel