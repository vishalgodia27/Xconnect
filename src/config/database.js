const mongoose=require("mongoose");
// const MONGO_URI=require(process.env.MONGO_URI);
async function connectoDB()
{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conneted to MongoDB");
}
module.exports=connectoDB;