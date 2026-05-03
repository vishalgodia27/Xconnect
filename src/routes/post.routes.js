// This api will be desinged only for  the user who is registerd and they have 
// token with it  that why this api will protected and if user  without the token try to access we will return the error un-autherized access

const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")



// /api/posts/
postRouter.post("/", postController.createPostController)



module.exports = postRouter