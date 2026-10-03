import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createUser, deleteUser, editUserPassword, getUser, loginUser } from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.patch("/user-edit",verifyJWT,editUserPassword);
userRouter.post("/user-create",createUser);
userRouter.delete("/user-delete",verifyJWT,deleteUser);
userRouter.post("/user-login",loginUser);
userRouter.get("/user-profile",verifyJWT,getUser);

