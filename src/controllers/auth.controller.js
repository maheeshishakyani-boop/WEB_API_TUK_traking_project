// // ================================================
// // AUTH CONTROLLER - handles register and login
// // ================================================
// const bcrypt = require('bcryptjs');
// const jwt    = require('jsonwebtoken');
// const { User } = require('../models');

// // Helper: create a JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '24h'
//   });
// };

// // POST /api/auth/register
// exports.register = async (req, res, next) => {
//   try {
//     const { name, email, password, role, police_station_id } = req.body;

//     // Check required fields
//     if (!name || !email || !password || !role) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide name, email, password, and role'
//       });
//     }

//     // Check if email already used
//     const existing = await User.findOne({ where: { email } });
//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: 'This email is already registered'
//       });
//     }

//     // Hash password (never save plain password!)
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const user = await User.create({
//       name, email,
//       password: hashedPassword,
//       role,
//       police_station_id: police_station_id || null
//     });

//     const token = generateToken(user.id);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       token,
//       data: {
//         id:    user.id,
//         name:  user.name,
//         email: user.email,
//         role:  user.role
//       }
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// // POST /api/auth/login
// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }

//     // Find user by email
//     const user = await User.findOne({ where: { email, is_active: true } });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     const token = generateToken(user.id);

//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       data: {
//         id:    user.id,
//         name:  user.name,
//         email: user.email,
//         role:  user.role
//       }
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// // GET /api/auth/me
// exports.getMe = async (req, res) => {
//   res.json({
//     success: true,
//     data: req.user
//   });
// };


// ================================================
// AUTH CONTROLLER
// ================================================
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

// POST /api/auth/register
// RBAC: Only ADMIN can create new users
// This prevents anyone from self-registering as admin
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, police_station_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role'
      });
    }

    // Only these 3 roles are allowed
    const validRoles = ['admin', 'officer', 'device'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be one of: admin, officer, device'
      });
    }

    // Check if email already registered
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    // Hash password — never store plain text
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name, email,
      password: hashedPassword,
      role,
      police_station_id: police_station_id || null
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
// Public — anyone can attempt login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ where: { email, is_active: true } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    data:    req.user
  });
};