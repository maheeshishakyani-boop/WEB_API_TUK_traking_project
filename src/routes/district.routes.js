// // ================================================
// // DISTRICT ROUTES
// // ================================================
// const express = require('express');
// const router  = express.Router();
// const ctrl    = require('../controllers/district.controller');
// const { protect, authorize } = require('../middleware/auth');

// /**
//  * @swagger
//  * tags:
//  *   name: Districts
//  *   description: Sri Lanka's 25 districts management
//  */

// /**
//  * @swagger
//  * /api/districts:
//  *   get:
//  *     summary: Get all districts (filter by province_id)
//  *     tags: [Districts]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: province_id
//  *         schema:
//  *           type: integer
//  *         description: Filter districts by province ID
//  *         example: 1
//  *     responses:
//  *       200:
//  *         description: List of districts
//  */
// router.get('/', protect, ctrl.getAll);

// /**
//  * @swagger
//  * /api/districts/{id}:
//  *   get:
//  *     summary: Get a single district with its police stations
//  *     tags: [Districts]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: District data
//  *       404:
//  *         description: District not found
//  */
// router.get('/:id', protect, ctrl.getOne);

// /**
//  * @swagger
//  * /api/districts:
//  *   post:
//  *     summary: Create a district (admin only)
//  *     tags: [Districts]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [name, province_id]
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "Colombo"
//  *               province_id:
//  *                 type: integer
//  *                 example: 1
//  *     responses:
//  *       201:
//  *         description: District created
//  */
// router.post('/', protect, authorize('admin'), ctrl.create);

// /**
//  * @swagger
//  * /api/districts/{id}:
//  *   put:
//  *     summary: Update a district (admin only)
//  *     tags: [Districts]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               province_id:
//  *                 type: integer
//  *     responses:
//  *       200:
//  *         description: District updated
//  */
// router.put('/:id', protect, authorize('admin'), ctrl.update);

// /**
//  * @swagger
//  * /api/districts/{id}:
//  *   delete:
//  *     summary: Delete a district (admin only)
//  *     tags: [Districts]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: District deleted
//  */
// router.delete('/:id', protect, authorize('admin'), ctrl.remove);

// module.exports = router;


// ================================================
// DISTRICT ROUTES
// RBAC: admin + officer can VIEW, admin only can WRITE
// device role has NO access
// ================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/district.controller');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: Sri Lanka's 25 districts
 */

/**
 * @swagger
 * /api/districts:
 *   get:
 *     summary: Get all districts — admin and officer only
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: province_id
 *         schema:
 *           type: integer
 *         description: Filter by province ID
 *         example: 1
 *     responses:
 *       200:
 *         description: List of districts
 *       403:
 *         description: Device accounts cannot access district data
 */
router.get('/', protect, authorize('admin', 'officer'), ctrl.getAll);

/**
 * @swagger
 * /api/districts/{id}:
 *   get:
 *     summary: Get a single district — admin and officer only
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: District with police stations
 *       404:
 *         description: District not found
 */
router.get('/:id', protect, authorize('admin', 'officer'), ctrl.getOne);

/**
 * @swagger
 * /api/districts:
 *   post:
 *     summary: Create a district — ADMIN ONLY
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, province_id]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Colombo"
 *               province_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: District created
 */
router.post('/',    protect, authorize('admin'), ctrl.create);

/**
 * @swagger
 * /api/districts/{id}:
 *   put:
 *     summary: Update a district — ADMIN ONLY
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               province_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: District updated
 */
router.put('/:id',    protect, authorize('admin'), ctrl.update);

/**
 * @swagger
 * /api/districts/{id}:
 *   delete:
 *     summary: Delete a district — ADMIN ONLY
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: District deleted
 */
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;