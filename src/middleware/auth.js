// ================================================
// AUTH MIDDLEWARE
// This checks: "Is the user logged in?"
// It reads the JWT token from the request header
// ================================================
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// protect() - checks if user is logged in
// Add this to any route that needs login
const protect = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    // It should look like: "Bearer eyJhbGciOiJ..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please login first.'
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in database
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'police_station_id']
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated.' });
    }

    // Attach user to request so controllers can use it
    req.user = user;
    next(); // continue to the actual route handler

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
  }
};

// authorize() - checks if user has the RIGHT role
// Example: authorize('admin') - only admins can access
// Example: authorize('admin', 'officer') - both can access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
