const userModel=require('../models/user.models')
const crypto=require("crypto")
const jwt=require("jsonwebtoken")


async  function registerController(req, res){//this is called as the controller 
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

};

async function loginController(req, res) {
	try {
		const { username, email, password } = req.body

		if (!password || (!username && !email)) {
			return res.status(400).json({
				message: "Username/Email and password are required"
			})
		}

		const user = await userModel.findOne({
			$or: [
				{ username: username },
				{ email: email }
			]
		})

		if (!user) {
			return res.status(404).json({
				message: "User not found"
			})
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)
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

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		})

		res.status(200).json({
			message: "user loggedIn Sucessfully",
			user: {
				username: user.username,
				email: user.email,
				bio: user.bio,
				profileImage: user.profileImage
			}
		})
	} catch (error) {
		res.status(500).json({
			message: "Server error",
			error: error.message
		})
	}
}
module.exports={
    registerController,
    loginController
}