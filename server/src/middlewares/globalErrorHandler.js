import config from "../config/config.js";
const phase = config.phase;

function globalErrorHandler(error, req, res, next) {
  const statusCode = error.status || 500;
  const errMsg = error.message || "Internal Server Error";

  console.error(`[${new Date().toISOString()}] Error: ${errMsg}`);
  if (phase.toLowerCase() === "development") {
    console.error(error.stack);
  }

  const payload = {
    status: statusCode,
    error: errMsg,
  };

  if (phase.toLowerCase() === "development") {
    payload.stack = error.stack;
    payload.name = error.name;
  }

  res.status(statusCode).json(payload);
}

export default globalErrorHandler;
