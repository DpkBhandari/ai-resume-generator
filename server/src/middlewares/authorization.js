// ✅ Authenticate user
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/user.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { generateToken } from "../services/auth.service.js";
const secret = config.jwt_secret;
export async function authenticate(req, res, next) {
  try {
    let token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        return next();
      } catch (err) {
        if (err.name !== "TokenExpiredError") throw err;
      }
    }

    // fallback to refresh token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return sendResponse(res, 401, "No token provided");

    const decodedRefresh = jwt.verify(refreshToken, secret);
    const user = await User.findById(decodedRefresh.id).select("+role");
    if (!user) return sendResponse(res, 401, "User not found");

    // generate new access token
    const newAccessToken = generateToken(user);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    req.user = { id: user._id, email: user.email, role: user.role };
    next();
  } catch (err) {
    return sendResponse(res, 401, "Unauthorized");
  }
}

// ✅ Authorize roles
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ status: 403, message: "Forbidden: Access denied" });
    }
    next();
  };
}
