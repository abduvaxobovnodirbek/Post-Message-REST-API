import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import multer from "multer"
import path from "path"
import crypto from "crypto"

const app = express()
dotenv.config()
const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT

app.use(cors())
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(express.static(path.join("public")))

// storing images to fileStorage and validating them
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,"./public/images")
    },
    filename:(req,file,cb)=>{
       cb(null,crypto.randomBytes(5).toString("hex") + file.originalname)
    }
})

const fileFilter = (req,file,cb)=>{
 if(file.mimetype === "image/png" ||file.mimetype === "image/jpg" ||file.mimetype === "image/jpeg"){
     cb(null,true)
  }else{
      cb(null,false)
  }
}

app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"))
// end of storing image and validating then



app.use("/posts",postRoutes)
app.use("/user",userRoutes)


app.get("/",(req,res)=>{
    res.send("Hello to Memory API")
})

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    app.listen(PORT)
    console.log(`server listens on port ${PORT}`)
})
.catch(err=>{
    console.log("serverga ulanmadi");
})


mongoose.set("useFindAndModify",false)



app.use((err,req,res,next)=>{
    if(!err.statusCode){
        err.statusCode = 500
    }
    console.log(err,"from error");
    res.status(err.statusCode).json({message:err.message})
})