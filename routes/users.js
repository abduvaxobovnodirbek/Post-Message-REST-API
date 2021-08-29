import express from "express"
import {signin,signup}  from "../controllers/users.js"
import {body} from "express-validator"
const router = express.Router()

// validating req.body that comes from client side
const validation = [
    body("email","validation error in email").isEmail().trim(),
    body("password","validation error in password").isLength({min:5}).trim()
]
//end of  validating req.body that comes from client side



router.post("/signin",validation,signin)
router.post("/signup",validation,signup)



export default router