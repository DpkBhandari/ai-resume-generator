import jwt from "jsonwebtoken";
import config from "../config/config.js";

const secret = config.jwt_secret;

// ✅ Authenticate user
export function authenticate(req, res, next) {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res
        .status(401)
        .json({ status: 401, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: 401, message: "Token expired. Refresh required." });
    }
    return res.status(401).json({ status: 401, message: "Invalid token" });
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
