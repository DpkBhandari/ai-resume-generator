import jwt from "jsonwebtoken";
import config from "../config/config.js";

import User from "../models/user.model.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/user.validator.js";

import { hashPassword, comparePassword } from "../services/user.auth.js";
import {
  generateToken,
  generateRefreshToken,
} from "../services/auth.service.js";
import { sendResponse } from "../utils/sendResponse.js";

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

    // Db Entry
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Response
    return sendResponse(res, 201, "User registered successfully", {
      id: newUser._id,
      email: newUser.email,
    });
  } catch (err) {
    return next(err);
  }
}

// Login user
export async function loginUser(req, res, next) {
  try {
    // Validation
    const { value, error } = loginValidator.validate(req.body);
    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    const { email, password } = value;

    // Db Search
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 400, "User does not exist");
    }

    // Compare password
    const isMatched = await comparePassword(password, user.password);
    if (!isMatched) {
      return sendResponse(res, 401, "Invalid credentials");
    }

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendResponse(res, 200, "User login successful");
  } catch (err) {
    return next(err);
  }
}

// Log-out User

export function logoutUser(req, res, next) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendResponse(res, 200, "Logout successfully");
}

// Refresh Token Controller
export function refreshTokenUser(req, res) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return sendResponse(res, 401, "No refresh token provided");
    }

    jwt.verify(oldRefreshToken, config.jwt_secret, async (err, decoded) => {
      if (err) {
        return sendResponse(res, 403, "Invalid or expired refresh token");
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return sendResponse(res, 404, "User not found");
      }

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
    });
  } catch (err) {
    return next(err);
  }
}
