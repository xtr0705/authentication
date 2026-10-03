import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import bcrypt from "bcryptjs";

const getUser = async(req,res)=>{
  try {
    const id = req.user.userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({
        message:"error finding user"
      })
    }

    const userInResponse = await User.findById(user._id).select("-password -refreshToken");
  
    return res.status(200).json({
      message:"User info fetched successfully",
      user:userInResponse
    });
  } catch (error) {
    return res.status(401).json({
        message:"error in getting user info"
      })
  }
}

const createUser = async (req , res)=>{
  try{
    const {username,email,password} = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username/email and password are required"
      });
    }
    
    
    const checkForExistingUser = await User.findOne({
      $or:[{email:email},{username:username}]
    })
    
    if (checkForExistingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password,10);
    if(!hashedPassword){
      return res.status(500).json({
        message: "error in password"
      });
    }
    const user = await User.create({
      username:username,
      email:email,
      password:hashedPassword
    })

    if (!user) {
      return res.status(500).json({
        message:"error in creating user"
      })
    }

    const finalUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(201).json({
      message:"User created successfully",
      user : finalUser
    })

  }catch(error){
    console.log("Error creating user : ",error);
    
  }
}

const deleteUser = async (req,res)=>{
  try {
    const id = req.user.userId;
  
    if (!id) {
      return res.status(500).json({
        message:"Could'nt retrieve user ID from URL"
      })
    }
  
    await User.findByIdAndDelete(id);
  
    return res.status(204).json({
      message:"User successfully deleted"
    })
  } catch (error) {
    console.log("error in deleting user : ",error);
  }
}

const editUserPassword = async (req,res)=>{
  try {
    const {password,newPassword,_id}=req.body;

    const user = await User.findById(_id);
    const isCorrect = await user.isPasswordCorrect(password);
    if (!isCorrect) {
      return res.status(400).json({
        message:"Incorrect password"
      })
    }
    const newPasswordHashed = await bcrypt.hash(newPassword,10);
    const newCredentials=await User.findByIdAndUpdate(_id,{password:newPasswordHashed},{new:true});
  
    return res.status(201).json({
      message:"password succesfully changed",
      newUser:newCredentials
    })
  } catch (error) {
    return res.status(500).json({
      message:"error in updating the password "
    })
  }
}

const loginUser = async (req,res)=>{
  const {email,username,password} = req.body;

  if (!username && !email){
    return alert("Please type a username or email to login")
  }

  const user = await User.findOne({
    $or:[{email},{username}]
  });

  if (!user) {
    console.log("error finding user");
    return;
  }

  const verifyPass= await user.isPasswordCorrect(password);

  if (!verifyPass) {
    return alert("password is incorrect");
  }

  const accessToken =  generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  if (!accessToken || !refreshToken) {
    return res.status(500).json({
      message:"Could'nt generate tokens"
    })
  }

  user.refreshToken = refreshToken;
  await user.save();
  const responseUser = await User.findOne(user._id).select("-password -refreshToken");

  const options = {httpOnly:true,secure:true};

  return res.cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).status(200).json({message:"Login successfull",responseUser});

}

const refreshAccessToken = async (req,res)=>{
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message:"Refresh Token not found";
      })
    }

    const payload = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({
        message:"User not found"
      })
    }

    const newAccessToken = jwt.sign({userId:user._id},process.env.JWT_ACCESS_SECRET,{expiresIn:"15m"})

    res.cookie("accessToken",newAccessToken,{
      httpOnly:true,
      secure:true
    });

    return res.status(200).json({
      message:"Access token refreshed"
    })

  } catch (error) {
    return res.status(401).json({
      message:"Invalid or expired refresh token"
    })
  }
}

export {createUser,loginUser,editUserPassword,deleteUser,getUser}