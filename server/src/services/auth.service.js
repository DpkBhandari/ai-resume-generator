import jwt from "jsonwebtoken";
import config from "../config/config.js";

const secret = config.jwt_secret;

// Generate Access Token
export function generateToken(user) {
  // const user = user;
  const _id = user._id || user.id;
  const email = user.email;
  const role = user.role;

  if (!_id || !email || !role) {
    throw new Error("Invalid user object for token generation");
  }
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secret,
    { expiresIn: "15m" }
  );
}

// Generate Refresh Token
export function generateRefreshToken(user) {
  if (!user || !user._id || !user.email || !user.role) {
    throw new Error("Invalid user object for refresh token");
  }
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );
}
