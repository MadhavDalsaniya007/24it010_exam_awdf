// Authentication Guard Middleware
// Verifies Bearer JWT token from Authorization header and attaches customer to req.user
const jwt = require('jsonwebtoken');

// Helper function to extract and verify JWT token
const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Middleware function to protect private routes
const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const decoded = verifyToken(authHeader);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing token',
      status: 401
    });
  }

  // Attach decoded user data (customerId, email, role, etc.) to request
  req.user = decoded;
  next();
};

module.exports = authGuard;
