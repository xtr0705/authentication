import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createUser, deleteUser, editUserPassword, getUser, loginUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/user-create",createUser);
router.patch("/user-edit",verifyJWT,editUserPassword);
router.delete("/user-delete",verifyJWT,deleteUser);
router.post("/user-login",loginUser);
router.get("/user-profile",verifyJWT,getUser);

