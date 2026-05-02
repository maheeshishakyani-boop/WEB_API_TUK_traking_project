// // ================================================
// // AUTH ROUTES
// // ================================================
// const express = require('express');
// const router  = express.Router();
// const { register, login, getMe } = require('../controllers/auth.controller');
// const { protect } = require('../middleware/auth');

// /**
//  * @swagger
//  * tags:
//  *   name: Authentication
//  *   description: Register and login endpoints
//  */

// /**
//  * @swagger
//  * /api/auth/register:
//  *   post:
//  *     summary: Register a new user (admin, officer, or device)
//  *     tags: [Authentication]
//  *     security: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [name, email, password, role]
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "Officer Perera"
//  *               email:
//  *                 type: string
//  *                 example: "perera@police.lk"
//  *               password:
//  *                 type: string
//  *                 example: "SecurePass123"
//  *               role:
//  *                 type: string
//  *                 enum: [admin, officer, device]
//  *                 example: "officer"
//  *               police_station_id:
//  *                 type: integer
//  *                 example: 1
//  *     responses:
//  *       201:
//  *         description: User registered successfully with JWT token
//  *       400:
//  *         description: Missing required fields
//  *       409:
//  *         description: Email already registered
//  */
// router.post('/register', register);

// /**
//  * @swagger
//  * /api/auth/login:
//  *   post:
//  *     summary: Login and receive JWT token
//  *     tags: [Authentication]
//  *     security: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [email, password]
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: "admin@police.lk"
//  *               password:
//  *                 type: string
//  *                 example: "admin123"
//  *     responses:
//  *       200:
//  *         description: Login successful - copy the token and use it in Authorize button
//  *       401:
//  *         description: Invalid email or password
//  */
// router.post('/login', login);

// /**
//  * @swagger
//  * /api/auth/me:
//  *   get:
//  *     summary: Get currently logged-in user info
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Current user data
//  *       401:
//  *         description: Not authenticated - please login first
//  */
// router.get('/me', protect, getMe);

// module.exports = router;


// ================================================
// AUTH ROUTES
// RBAC Summary:
//   POST /login    → public (anyone)
//   POST /register → admin only (only admin creates users)
//   GET  /me       → any logged-in user
// ================================================
const express = require('express');
const router  = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect, authorize }     = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Login and user management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT token (public)
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@police.lk"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Login successful — copy the token and click Authorize above
 *       401:
 *         description: Invalid email or password
 *       429:
 *         description: Too many login attempts — rate limited
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new user account — ADMIN ONLY
 *     description: "Only admins can create new user accounts. Role must be: admin, officer, or device"
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Officer Perera"
 *               email:
 *                 type: string
 *                 example: "newuser@police.lk"
 *               password:
 *                 type: string
 *                 example: "SecurePass123"
 *               role:
 *                 type: string
 *                 enum: [admin, officer, device]
 *                 example: "officer"
 *               police_station_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing fields or invalid role
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Only admins can create users
 *       409:
 *         description: Email already registered
 */
router.post('/register', protect, authorize('admin'), register);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently logged-in user info
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *       401:
 *         description: Not logged in
 */
router.get('/me', protect, getMe);

module.exports = router;