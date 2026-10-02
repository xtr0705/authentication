import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  refreshToken:{
    type:String,
    required:true
  }
},{
  timestamps:true
})

userSchema.methods.isPasswordCorrect = async function (password){
  if (await bcrypt.compare(password,this.password)) {
    return true;
  }
  return false;
}

const User = mongoose.model("User",userSchema);

export default User;