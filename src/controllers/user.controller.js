import User from "../models/user.model";

const createUser = async (req , res)=>{
  try{
    const {username,email,password} = req.body;
    if (!username || !email || !password) {
      return alert("please fill all the required fields to create a user");
    }

    const user = await User.create({
      username:username,
      email:email,
      password:password
    })

    if (!user) {
      console.log("error in storing user in DB",);
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
  const id = req.params.id;

  if (!id) {
    console.log("could'nt retrieve user id"); 
  }

  await User.findByIdAndDelete(id);

  return req.status(204).json({
    message:"User successfully deleted"
  })
}

