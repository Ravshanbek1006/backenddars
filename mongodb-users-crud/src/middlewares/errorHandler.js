function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === "production";

  // Mongoose validation errors
  if (err?.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ message: "Validation error", errors });
  }

  // Duplicate key (e.g. unique email)
  if (err?.code === 11000) {
    const fields = err.keyValue ? Object.keys(err.keyValue) : [];
    return res.status(409).json({
      message: "Duplicate key error",
      fields,
    });
  }

  const statusCode = err?.statusCode || 500;
  res.status(statusCode).json({
    message: err?.message || "Internal Server Error",
    ...(isProd ? {} : { stack: err?.stack }),
  });
}

module.exports = errorHandler;
