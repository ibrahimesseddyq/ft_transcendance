/**
 * Authentication Middleware
 * Extracts user information from request headers
 * In production, this would validate JWT tokens from auth service
 */

const authMiddleware = (req, res, next) => {
  try {
    // Extract user info from headers (set by API Gateway or Auth Service)
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Missing user credentials in headers',
      });
    }

    // Validate role
    const validRoles = ['hr', 'client'];
    if (!validRoles.includes(userRole.toLowerCase())) {
      return res.status(403).json({
        success: false,
        error: 'Invalid user role',
        message: 'User role must be either "hr" or "client"',
      });
    }

    // Attach user info to request object
    req.user = {
      id: userId,
      role: userRole.toLowerCase(),
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: error.message,
    });
  }
};

module.exports = authMiddleware;
