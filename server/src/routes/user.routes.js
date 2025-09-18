import express from "express";
const userRoutes = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
} from "../controllers/user.controllers.js";
userRoutes.post("/register", registerUser);

userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);
userRoutes.post("/refresh", refreshTokenUser);

export default userRoutes;
