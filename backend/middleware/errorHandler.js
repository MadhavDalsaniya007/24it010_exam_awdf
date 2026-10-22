// Global Error Handling Middleware
// Returns friendly JSON errors without stack traces
// Handles Mongoose ValidationError, CastError, and Duplicate Key (11000)

const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Error (e.g. required field missing, enum mismatch)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}': ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error (code 11000, e.g. unique email or licenseNumber)
  if (err.code === 11000) {
    statusCode = 400;
    const fields = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate entry: '${fields}' already exists`;
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    status: statusCode
  });
};

module.exports = errorHandler;
