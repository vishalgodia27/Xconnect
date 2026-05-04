const postModel = require('../models/post.model')

async function createPostController(req, res, error) {
    console.log(req.body)
    console.log(req.file)   
    res.send("file and text updatated sucess-fully ")
    // res.send(error)
}
module.exports = {
    createPostController
}