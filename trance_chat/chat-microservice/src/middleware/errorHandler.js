/**
 * Global Error Handler Middleware
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MySQL/MariaDB duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate Error',
      message: 'A chat already exists between these users',
    });
  }

  // MySQL/MariaDB foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      error: 'Invalid Reference',
      message: 'Referenced chat does not exist',
    });
  }

  // MySQL/MariaDB validation errors
  if (err.code === 'ER_DATA_TOO_LONG') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Data exceeds maximum length',
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      code: err.code 
    }),
  });
};

module.exports = errorHandler;
