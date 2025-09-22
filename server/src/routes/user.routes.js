import express from "express";
import {
  registerUser,
  loginUser,
  verifyMail,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controllers.js";
import {
  logoutUser,
  refreshTokenUser,
  resendOtp,
} from "../controllers/user.auth.controllers.js";
import { authenticate } from "../middlewares/authorization.js";

const userRoutes = express.Router();

// Working And Tested Using Postman : ✅
// Not Working As Expected Using Postman : 🚫

// Public Routes (No authentication needed)
userRoutes.post("/register", registerUser); //✅
userRoutes.post("/login", loginUser); //✅
userRoutes.post("/verify-email", verifyMail); //✅
userRoutes.post("/resendmail", resendOtp); //✅
userRoutes.post("/forgot-password", forgotPassword); //✅
userRoutes.patch("/reset-password", resetPassword); //✅

// Protected Routes (Authentication required)
userRoutes.post("/logout", authenticate, logoutUser); // ✅
userRoutes.post("/refresh", authenticate, refreshTokenUser); //✅

export default userRoutes;
