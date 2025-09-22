import jwt from "jsonwebtoken";

import config from "../config/config.js";

import crypto from "crypto";

import User from "../models/user.model.js";

import { sendOtpMail } from "../config/mail.config.js";

import { generateToken } from "../services/auth.service.js";

import { sendResponse } from "../utils/sendResponse.js";

import { resendOtpValidator } from "../validators/user.validator.js";

import { hashPassword } from "../services/user.auth.js";
// Log-out User ✅

export function logoutUser(req, res, next) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendResponse(res, 200, "Logout successfully");
}

// Refresh Token Controller ✅

export async function refreshTokenUser(req, res, next) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken)
      return sendResponse(res, 401, "No refresh token provided");

    const decoded = jwt.verify(oldRefreshToken, config.jwt_secret);
    const user = await User.findById(decoded.id);
    if (!user) return sendResponse(res, 404, "User not found");

    const newAccessToken = generateToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    return sendResponse(res, 200, "New access token issued", {
      newAccessToken,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendResponse(
        res,
        401,
        "Refresh token expired. Please login again."
      );
    }
    return next(err); // delegate to global error handler
  }
}

// Resend Otp 🚫
export async function resendOtp(req, res) {
  try {
    const { value, error } = resendOtpValidator.validate(req.body);
    if (error) return sendResponse(res, 400, "Invalid email");

    const { email } = value;
    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, 404, "User not found");

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const hashVerificationCode = await hashPassword(verificationCode);

    console.log(`Otp : ${verificationCode}`);
    console.log(`Hash-Otp : ${hashVerificationCode}`);

    user.verificationCode = hashVerificationCode;
    user.verificationCodeExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // ✅ Pass the correct code
    await sendOtpMail(user.email, verificationCode, "resendOtp");

    return sendResponse(res, 200, "OTP sent successfully!");
  } catch (err) {
    console.error("Resend OTP error:", err); // Log the actual error
    return sendResponse(res, 500, "Failed to resend OTP");
  }
}
