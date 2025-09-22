import User from "../models/user.model.js";
import {
  registerValidator,
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
} from "../validators/user.validator.js";

import {
  generateToken,
  generateRefreshToken,
} from "../services/auth.service.js";

import crypto from "crypto";

import { hashPassword, comparePassword } from "../services/user.auth.js";

import { sendResponse } from "../utils/sendResponse.js";

import { sendOtpMail } from "../config/mail.config.js";

// User Registeration ✅

export async function registerUser(req, res, next) {
  try {
    // Validation
    const { value, error } = registerValidator.validate(req.body);
    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    const { name, email, password } = value;

    // Db Search
    const user = await User.findOne({ email });
    if (user) {
      return sendResponse(res, 409, "User already exists!");
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);
    // Verifiaction Code Generation
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const hashVerificationCode = await hashPassword(verificationCode);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode: hashVerificationCode,
      verificationCodeExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    // sending mail

    try {
      await sendOtpMail(newUser.email, verificationCode, "register");
    } catch (mailErr) {
      console.error("❌ Failed to send verification email:", mailErr);

      await User.findByIdAndDelete(newUser._id);

      return res.status(500).json({
        status: 500,
        message: "Registration failed: could not send verification email",
      });
    }

    // Response
    return sendResponse(res, 201, "User registered successfully", {
      id: newUser._id,
      email: newUser.email,
    });
  } catch (err) {
    return next(err);
  }
}

// Login user ✅

export async function loginUser(req, res, next) {
  try {
    // 1️⃣ Validate input
    const { value, error } = loginValidator.validate(req.body);

    if (error) return sendResponse(res, 400, error.details[0].message);

    const { email, password } = value;

    // 2️⃣ Fetch user including password and role
    const user = await User.findOne({ email }).select("+password role email");

    if (!user) return sendResponse(res, 400, "User does not exist");

    if (!user.password)
      return sendResponse(res, 500, "User password is missing in DB");

    // 3️⃣ Compare password

    const isMatched = await comparePassword(password, user.password);

    if (!isMatched) return sendResponse(res, 401, "Invalid credentials");

    // 4️⃣ Generate tokens using fresh DB data
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5️⃣ Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6️⃣ Return response including role if needed
    return sendResponse(res, 200, "User login successful");
  } catch (err) {
    return next(err);
  }
}
// Verifying Mail ✅

export async function verifyMail(req, res, next) {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, 404, "User not found");

    if (user.verificationCodeExpires < Date.now()) {
      return sendResponse(res, 400, "OTP expired");
    }

    const isMatchedOtp = await comparePassword(code, user.verificationCode);

    if (!isMatchedOtp) {
      return sendResponse(res, 400, "Invalid or expired verification code");
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return sendResponse(res, 200, "Email verified successfully");
  } catch (err) {
    return next(err);
  }
}

// Forgot Password ✅

export async function forgotPassword(req, res, next) {
  try {
    const { value, error } = forgotPasswordValidator.validate(req.body);

    if (error) {
      return sendResponse(res, 400, "Invalid email format");
    }

    const { email } = value;
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 404, "User doesn't exist");
    }
    // Generating verificationCode And Sending Via Email

    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const hashVerificationCode = await hashPassword(verificationCode);

    try {
      await sendOtpMail(user.email, verificationCode, "forgotPassword");
    } catch (mailErr) {
      console.error("❌ Failed to send verification email:", mailErr);

      // await User.findByIdAndDelete(newUser._id);

      return res.status(500).json({
        status: 500,
        message: "Failed to send verification email",
      });
    }

    user.verificationCode = hashVerificationCode;
    user.verificationCodeExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    return sendResponse(res, 200, "Verification Code on Registered Email", {
      email,
    });
  } catch (err) {
    return next(err);
  }
}

// Reset Password ✅

export async function resetPassword(req, res, next) {
  try {
    const { value, error } = resetPasswordValidator.validate(req.body);

    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    const { email, code, newPassword } = value;

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 404, "User doesn't exist");
    }

    if (!user.verificationCode || user.verificationCodeExpires < Date.now()) {
      return sendResponse(res, 400, "OTP expired or invalid");
    }

    const validateOtp = await comparePassword(code, user.verificationCode);

    if (!validateOtp) {
      return sendResponse(res, 400, "Invalid OTP");
    }

    user.password = await hashPassword(newPassword);
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    // Password Updated
    await sendOtpMail(user.email, "", "updatePassword", user.name);
    return sendResponse(res, 201, "Password updated successfully");
  } catch (err) {
    return next(err);
  }
}
