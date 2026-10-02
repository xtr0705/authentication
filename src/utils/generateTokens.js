import jwt from "jsonwebtoken"

const generateAccessToken = (user)=>{
  return jwt.sign(
    {
      userId:user._id
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn:"15m"
    }
  );
};

const generateRefreshToken = (user)=>{
  return jwt.sign(
    {
      userId:user._id
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:"7d"
    }
  );
};

export {generateAccessToken,generateRefreshToken};