import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens";

const getUser = async(req,res)=>{
  try {
    const {id} = req.body;
    const user = await User.findById(id);
    if (!user) {
      console.log("error in finding user")
      return;
    }
  
    return res.status(200).json(user);
  } catch (error) {
    console.log("error in retrieving user info")
  }
}

const createUser = async (req , res)=>{
  try{
    const {username,email,password} = req.body;
    if (!username || !email || !password) {
      return alert("please fill all the required fields to create a user");
    }


    const checkForExistingUser = await User.findOne({
      $or:[{email:email},{username:username}]
    })

    if (checkForExistingUser) {
      return alert("User with this email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(password,10);
    if(!hashedPassword){
      console.log("error in password");
      return;
    }
    const user = await User.create({
      username:username,
      email:email,
      password:hashedPassword
    })

    if (!user) {
      console.log("error in storing user in DB");
      return;
    }

    return res.status(201).json({
      message:"User created successfully",
      user : user
    })

  }catch(error){
    console.log("Error creating user : ",error);
    
  }
}

const deleteUser = async (req,res)=>{
  try {
    const id = req.params.id;
  
    if (!id) {
      console.log("could'nt retrieve user id"); 
      return;
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
    const {password,newPassword,id}=req.body;
    const isCorrect = await User.isPasswordCorrect(password);
    if (!isCorrect) {
      console.log("Please enter correct current password");
      return;
    }
    const newPasswordHashed = await bcrypt.hash(newPassword,10);
    const newCredentials=await User.findByIdAndUpdate(id,{password:newPasswordHashed},{new:true});
  
    return res.status(201).json({
      message:"password succesfully changed",
      newUser:newCredentials
    })
  } catch (error) {
    console.log("error in updating the password ",error)
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

  const verifyPass= await User.isPasswordCorrect(password,user.password);

  if (!verifyPass) {
    return alert("password is incorrect");
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  user.refreshToken = refreshToken;
  const responseUser = await User.findOne(user._id).select("-password -refreshToken");

  if (!accessToken || !refreshToken) {
    console.log("could'nt generate tokens");
  }
  const options = {httpOnly:true,secure:true};

  return res.cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).status(200).json({message:"Login successfull",responseUser});

}