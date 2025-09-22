import { sendResponse } from "../utils/sendResponse.js";

export function adminProtect(req, res, next) {
  try {
    if (!req.user) {
      return sendResponse(res, 401, "Unauthorized, login required");
    }

    if (req.user?.role !== "admin") {
      return sendResponse(res, 403, "Forbidden");
    }
    next();
  } catch (err) {
    console.log(err.message);
    return next(err);
  }
}
