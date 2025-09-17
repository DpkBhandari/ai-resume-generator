import jwt from "jsonwebtoken";
import config from "../config/config.js";

const secrete = config.jwt_secret;

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secrete,
    { expiresIn: "15m" }
  );
}
