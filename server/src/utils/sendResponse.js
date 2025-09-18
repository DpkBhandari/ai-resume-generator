export function sendResponse(res, statusCode, message, data = null) {
  const payload = {
    statusCode,
    message,
  };
  if (data) payload.data = data;

  return res.status(statusCode).json(payload);
}
