import mongoose from "mongoose";

const connectionDB = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected successfully");
  }catch(error){
    console.log("MONGODB connection failed : ",error);
    process.exit(1);
  }
}

export default connectionDB;