import config from "../config/config.js";
const phase = config.phase;

function globalErrorHandler(error, req, res, next) {
  const statusCode = error.status || 500;
  const errMsg = error.message || "Internal Server Error";

  res.status(statusCode).json({
    status: statusCode,
    error: errMsg,
    stack:
      phase.toLowerCase() === "development"
        ? error.stack
        : "Something went wrong. Please try again later.",
  });
}

export default globalErrorHandler;
