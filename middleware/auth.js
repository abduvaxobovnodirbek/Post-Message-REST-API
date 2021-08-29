import jwt from "jsonwebtoken";


const auth = async (req,res,next)=>{
    try {
        const token  = req.headers?.authorization?.split(" ")[1]
        let decodedToken;
        if(token){
           decodedToken = jwt.verify(token,"test")
           req.userId = decodedToken?.id
           next()
        }        
    } catch (error) {
        console.log(error);
    }
}

export default auth