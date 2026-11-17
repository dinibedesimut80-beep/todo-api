const AppError = require("../utils/AppError");

function checkApiKey(req, res, next) {
  // API key dikirim lewat header custom: x-api-key
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return next(new AppError("API key is missing. Provide it via 'x-api-key' header", 401));
  }

  // Tambahkan fallback "test-api-key" agar tidak undefined saat testing
  const validApiKey = process.env.EXTERNAL_API_KEY || "test-api-key";

  if (apiKey !== validApiKey) {
    return next(new AppError("Invalid API key", 401));
  }

  next();
}

module.exports = checkApiKey;