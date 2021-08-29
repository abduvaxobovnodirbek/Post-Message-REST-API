import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

const auth = async (req,res,next)=>{
    try {
        const token  = req.headers?.authorization?.split(" ")[1]
        let decodedToken;
        if(token){
           decodedToken = jwt.verify(token, process.env.TOKEN)
           req.userId = decodedToken?.id
           next()
        }        
    } catch (error) {
        console.log(error);
    }
}

export default auth