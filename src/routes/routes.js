import express from "express";

const router = express.Router();

router.post("/user-create","createUser");
router.patch("/user-edit","editUser");
router.delete("/user-delete","deleteUser");
router.post("/user-login","loginUser");
