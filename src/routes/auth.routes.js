const express = require("express")
const authController=require("../controllers/auth.controller")
const authRouter=express.Router()
// there is two much access the data for checking the resutls  it causes lode on the database 
authRouter.post('/register',authController.registerController);

authRouter.post("/login", authController.loginController);
module.exports = authRouter;