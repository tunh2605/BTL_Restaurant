import express from "express";
import {
  addUser,
  getUser,
  loginUser,
  updateAvatar,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", addUser);
userRouter.post("/login", loginUser);
userRouter.get("/user", verifyToken, getUser);
userRouter.put("/update-avatar", verifyToken, updateAvatar);

export default userRouter;
