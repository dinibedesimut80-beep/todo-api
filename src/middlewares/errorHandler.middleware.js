const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  // Hanya cetak log error ke console jika BUKAN sedang dalam mode test
  if (process.env.NODE_ENV !== "test") {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 1. Mongoose ValidationError — field wajib diisi/tidak sesuai skema
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // 2. Mongoose CastError — format ID tidak valid
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}": ${err.value}`;
  }

  // 3. Mongoose Duplicate Key Error — data unik sudah ada di database
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  // 4. JWT Error — Token tidak valid
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  // 5. JWT Error — Token kedaluwarsa
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  // Kirim response akhir ke client
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

module.exports = errorHandler;