import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function authenticate(req, res, next) {
  try {
    // You can also check req.cookies.token if you set it in cookies
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }

    const decoded = jwt.verify(token, config.jwt_secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You don’t have access" });
    }
    next();
  };
}
