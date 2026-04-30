require('dotenv').config()// this line is used for the accessing the env varibles 
 
const app=require('./src/app')
const connectoDB=require("./src/config/database")
connectoDB();
app.listen(3000,()=>{
    console.log("server is running on the port 3000")
})