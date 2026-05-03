const postModel = require('../models/post.model')

async function createPostController(req, res,error) {
    console.log(req.body)
    res.send(error)
}
module.exports = {
    createPostController
}