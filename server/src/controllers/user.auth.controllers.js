import jwt from "jsonwebtoken";

import config from "../config/config.js";

import crypto from "crypto";

import User from "../models/user.model.js";

import { sendMail } from "../config/mail.config.js";

import { generateToken } from "../services/auth.service.js";

import { sendResponse } from "../utils/sendResponse.js";

// Log-out User

export function logoutUser(req, res, next) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendResponse(res, 200, "Logout successfully");
}

// Refresh Token Controller

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

// Resend Otp

export async function resendOtp(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(res, 404, "User not found");
  }

  try {
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const hashVerificationCode = await hashPassword(verificationCode);

    user.verificationCode = hashVerificationCode;
    user.verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    // Send OTP
    await sendMail(user.email, verificationCode);

    return sendResponse(res, 200, "OTP sent successfully!");
  } catch (err) {
    return sendResponse(res, 500, "Failed to resend OTP");
  }
}
