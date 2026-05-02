// ================================================
// PROVINCE ROUTES
// ================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/province.controller');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: Sri Lanka's 9 provinces management
 */

/**
 * @swagger
 * /api/provinces:
 *   get:
 *     summary: Get all 9 provinces with their districts
 *     tags: [Provinces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all provinces
 */
router.get('/', protect, ctrl.getAll);

/**
 * @swagger
 * /api/provinces/{id}:
 *   get:
 *     summary: Get a single province by ID
 *     tags: [Provinces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Province data with districts
 *       404:
 *         description: Province not found
 */
router.get('/:id', protect, ctrl.getOne);

/**
 * @swagger
 * /api/provinces:
 *   post:
 *     summary: Create a new province (admin only)
 *     tags: [Provinces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Western Province"
 *               code:
 *                 type: string
 *                 example: "WP"
 *     responses:
 *       201:
 *         description: Province created
 *       403:
 *         description: Admin access required
 */
router.post('/', protect, authorize('admin'), ctrl.create);

/**
 * @swagger
 * /api/provinces/{id}:
 *   put:
 *     summary: Update a province (admin only)
 *     tags: [Provinces]
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
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Province updated
 *       404:
 *         description: Province not found
 */
router.put('/:id', protect, authorize('admin'), ctrl.update);

/**
 * @swagger
 * /api/provinces/{id}:
 *   delete:
 *     summary: Delete a province (admin only)
 *     tags: [Provinces]
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
 *         description: Province deleted
 *       404:
 *         description: Province not found
 */
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;
