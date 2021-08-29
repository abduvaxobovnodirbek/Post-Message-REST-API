import User from "../models/users.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {validationResult} from "express-validator"


export const signup = async (req,res,next)=>{
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const email = req.body.email
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg)
        res.status(422).json({message:error})
    }
    if(confirmPassword !== password){
        const error = new Error("password dont match")
        res.status(422).json({message:error})
    }

    try {
        const user = await User.findOne({email:email})
        
        if(user){
            const error = new Error("this user already exists")
            res.status(403).json({message:error})
        }

        const hashedPassword = await bcrypt.hash(password,12)

        const newUser = await User.create({
            name:`${firstName} ${lastName}`,
            email:email,
            password:hashedPassword
        })
        await newUser.save() 

        const token = jwt.sign({email:newUser.email,id:newUser._id},"test",{expiresIn:"1h"})

        res.status(200).json({result:newUser,token:token})
    } catch (error) {
        next(error)
    }
}


export const signin = async (req,res,next)=>{
   const {email,password} = req.body
   
   try {
    const user = await User.findOne({email:email})
   
    if(!user){
        const error = new Error("no user")
        res.status(404).json({message:error})
    }
    const passwordMatch = await bcrypt.compare(password,user.password)
 
    if(!passwordMatch){
        const error = new Error("no user found out with that password")
        res.status(404).json({message:error})
    }

    const token = jwt.sign({email:user.email,id:user._id},"test",{expiresIn:"1h"})

    res.status(200).json({result:user,token:token})

   } catch (error) {
     next(error)  
   }

}