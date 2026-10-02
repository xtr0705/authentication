import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/user-create","createUser");
router.patch("/user-edit","editUser");
router.delete("/user-delete","deleteUser");
router.post("/user-login","loginUser");
router.get("/user-profile",verifyJWT,ge)
