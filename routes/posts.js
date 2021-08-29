import express from "express"
import {body} from "express-validator"
import auth from "../middleware/auth.js"

import {getPosts,createPost,updatePost,deletePost,likePost,getPostsBySearch,getPost} from "../controllers/posts.js"
const router = express.Router()

// validating req.body that comes from client side
const validation = [
    body("title","validation error in title").notEmpty().trim(),
    body("message","validation error in message").notEmpty().trim(),
    body("tags","validation error in tags").notEmpty().trim()
]
//end of  validating req.body that comes from client side



router.get("/",getPosts)

router.get("/detail/:id",getPost)

router.get("/search",getPostsBySearch)

router.post("/",validation,auth,createPost)

router.patch("/:id",validation,auth,updatePost)

router.delete("/:id",auth,deletePost)

router.patch("/:id/likePost",auth,likePost)


export default router