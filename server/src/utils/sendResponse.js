export function sendResponse(
  res,
  statusCode,
  message,
  data = null,
  isError = false
) {
  const payload = { statusCode, message };
  if (data) payload.data = data;
  if (isError) payload.error = true;
  return res.status(statusCode).json(payload);
}
