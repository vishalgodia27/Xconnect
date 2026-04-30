const crypto = require("crypto")
const express = require("express")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.models")
const authRouter = express.Router()
// there is two much access the data for checking the resutls  it causes lode on the database 
authRouter.post('/register', async (req, res) => {//this is called as the controller 
        const { email, username, password, profileImage } = req.body
        const isUserExistByEmail = await userModel.findOne({ email })
        // if(isUserExistByEmail)
        // {
        //         return res.status(409).json({
        //                 message:"User already exists with same email"
        //         })
        // }
        // const isUserExistByUsername=await userModel.findOne({username})
        // if(isUserExistByUsername)
        // {
        //         return res.status(409).json({
        //                 message:"user already exist by username"
        //         })
        // }
        // this method help to reduce the load on the database for accessing and asking and checking data on username or email id 
        const isUserAlreadyExists = await userModel.findOne({
                //this dollar or operator uses this method for making the data base efficently 
                $or: [
                        { username },
                        { email }
                ]

        })
        if (isUserAlreadyExists) {
                return res.status(409)
                        .json({
                                message: "User already exist " + (isUserAlreadyExists.email ==
                                        email ? "Email already exists" : "Username already exists")
                        })

        }
        const hash = crypto.createHash('sha256').update(password).digest('hex')// this will create the password into the hash 
        // this  will create the  data in the mongoDB and we can say this will save the user data in the database 
        const user = await userModel.create({
                username,
                email,
                profileImage,
                password: hash
        })
        /* 
               1.it must have two condiotion frsitly they have the userdata,
               2.data unique hona chaiye 
              
         */
        // password never travles from the server site to clint site any how because it can cause thee security risk 

        const token = jwt.sign({
                id: user._id
        },
                process.env.JWT_SECRET, {
                expiresIn: "1d"
        }

        )
        res.cookie("token", token)

        // here we are sending everything except the password because it can cause security concerns
        res.status(201).json({
                message: "User Registerd sucessfully",
                user: {
                        email: user.email,
                        username: user.username,
                        bio: user.bio,
                        profileImage: user.profileImage
                }

        })

});

authRouter.post("/login", async (req, res) => {
        const { username, email, password } = req.body

        /* 
        user can login using the username and password or email and password 
       */
        //for using the or we have to pass the array of coditions to check the two things 
        const user = await userModel.findOne({
                $or: [
                        {
                                username: username
                        },
                        {
                                email: email
                        }
                ]
        })

        if (!user) {
                return res.status(404).json({
                        message: "User not found"
                })
        }
        const hash = crypto.createHash('sha256').update(password).digest('hex')
        const isPasswordValid = hash == user.password
        if (!isPasswordValid) {
                return res.status(401).json({
                        message: "Invalid password"
                })
        }
        const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
        )
        res.cookie("token", token)
        res.status(200)
                .json({
                        message: "user loggedIn Sucessfully",
                        user: {
                                username: user.username,
                                email: user.email,
                                bio: user.bio,
                                profileImage: user.profileImage
                        }

                })

})
module.exports = authRouter;