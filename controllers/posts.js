import PostMessage from "../models/postMessage.js";
import User from "../models/users.js"
import {validationResult} from "express-validator"
import fs from "fs"
import path from "path"

export const getPosts = async (req,res,next)=>{
    const {page} = req.query
     try {
         const LIMIT = 8
         let startIndex = (Number(page)-1)*LIMIT
         const total = await PostMessage.countDocuments()
         const postMessages = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex)
         
         if(!postMessages){
             throw new Error("no posts found out")
         }
         
         res.status(200).json({data:postMessages,currentPage:Number(page),numberOfPage:Math.ceil(total/LIMIT)})

     } catch (error) {
         next(error)
     }
}

export const getPost = async (req,res,next)=>{
    const {id} = req.params
     try {
         const post = await PostMessage.findById(id.toString())        
         
         res.status(200).json(post)

     } catch (error) {
         next(error)
     }
}


export const getPostsBySearch = async (req,res,next)=>{
    const {searchQuery} = req.query
    try {
        const title = new RegExp(searchQuery,"i")
        const postMessages = await PostMessage.find({title:title})
        
        if(!postMessages){
            throw new Error("no posts found out")
        }
        res.status(200).json(postMessages)
    } catch (error) {
        next(error)
    }
}

export const createPost = async (req,res,next)=>{
    const title = req.body.title
    const message = req.body.message
    const tags = req.body.tags.split(",")
    const image = req.file
    const user = req.userId
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       const error = new Error(errors.array()[0].msg)
       res.status(422).json({message:error})
    }

    if(!image){
        const error =  new Error("no image found")
        res.status(422).json({message:error})
    }
    
    try {
        const creator = await User.findById(user)
        const newPost = new PostMessage({title,message,tags,image:image.filename,user})
        if(creator){
          newPost.creator =  creator.name.split(' ')[0]  
        }
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        next(error)
    }
}



export const updatePost = async (req,res,next)=>{
    const {id} = req.params
    const title = req.body.title
    const message = req.body.message
    const tags = req.body.tags.split(",")
    const image = req.file
     
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg)
        res.status(422).json({message:error})
    }
    
    try {
        const updatedPost = await PostMessage.findById({_id:id})
        
        if(!updatedPost){
            let error =  new Error("no id found with entered id updatepost error")
            res.status(422).json({message:error})
        }
        
        if(req.userId.toString() !== updatedPost.user.toString()){
            let error = new Error("you cannot update others memory")
            res.status(422).json({message:error})
        }

         updatedPost.title = title
         updatedPost.message = message
         updatedPost.tags = tags

         if(image){
            fs.unlink(path.join("public","images",updatedPost.image),err=>{
                console.log(err);
            })
            updatedPost.image = image.filename
         }else{
            updatedPost.image = updatedPost.image
         }

        await updatedPost.save()
        res.status(201).json(updatedPost)

    } catch (error) {
        next(error)
    }
}


export const deletePost = async (req,res,next)=>{
    const {id} = req.params

    try {
       const post = await PostMessage.findById(id)
       
       if(!post){
        let error =  new Error("no id found with entered id deletePost error")
         res.status(404).json({message:error})
       }

       if(req.userId.toString() !== post.user.toString()){
        let error =  new Error("you cannnot delete others memory")
        res.status(404).json({message:error})
       }
       
       fs.unlink(path.join("public","images",post.image),err=>{
        console.log(err);
        })

       await  post.remove()
       res.status(200).json({message:"post deleted succesfully"})
    } catch (error) {
        next(error)
    }
}



export const likePost = async (req,res,next)=>{
    const {id} = req.params
    
    if(!req.userId){
        let error =  new Error("user is not authorizated")
        res.status(404).json({message:error})
    }

    try {
       const post = await PostMessage.findById(id)
       
       if(!post){
        let error =  new Error("no id found with entered id likePost error")
        res.status(404).json({message:error})
       }
       
       const index = post.likes.findIndex(id=>id === req.userId)
       
       if(index === -1){
           post.likes.push(req.userId)
       }else{
           post.likes = post.likes.filter(id=>id !== req.userId)
       }

       const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true})
       
       res.status(201).json(updatedPost)
    } catch (error) {
        next(error)
    }
}