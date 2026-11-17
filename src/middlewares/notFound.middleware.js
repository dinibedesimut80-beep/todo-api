const AppError = require("../utils/AppError"); // ✅ Diubah ke ../utils/AppError

function notFound(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
}

module.exports = notFound;