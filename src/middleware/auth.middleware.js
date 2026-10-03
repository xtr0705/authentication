import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const verifyJWT =  (req,res,next)=>{
  try{
    const token = req.cookies.accessToken 
    // get cookie from pc browser. if it is a mobile then get from header.
    if (!token) {
      return res.status(401).json({
        message:"Could'nt fetch the token or token not present in cookies"
      })
    }
    const user =  jwt.verify(token,process.env.JWT_ACCESS_SECRET);
    req.user = user;
    next();
  }catch(error){
    return res.status(401).json({
      message:"invalid or expired token"
    })
  }
}

export {verifyJWT};