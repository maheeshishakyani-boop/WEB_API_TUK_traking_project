// ================================================
// POLICE STATION ROUTES
// ================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/station.controller');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Police Stations
 *   description: Police station management
 */

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: Get all police stations (filter by district_id)
 *     tags: [Police Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: district_id
 *         schema:
 *           type: integer
 *         description: Filter by district ID
 *     responses:
 *       200:
 *         description: List of police stations
 */
router.get('/', protect, ctrl.getAll);

/**
 * @swagger
 * /api/stations/{id}:
 *   get:
 *     summary: Get a single police station
 *     tags: [Police Stations]
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
 *         description: Station data
 *       404:
 *         description: Station not found
 */
router.get('/:id', protect, ctrl.getOne);

/**
 * @swagger
 * /api/stations:
 *   post:
 *     summary: Create a police station (admin only)
 *     tags: [Police Stations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, district_id]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Colombo Fort Police Station"
 *               district_id:
 *                 type: integer
 *                 example: 1
 *               address:
 *                 type: string
 *                 example: "Colombo 01, Sri Lanka"
 *               phone:
 *                 type: string
 *                 example: "011-2323232"
 *     responses:
 *       201:
 *         description: Station created
 */
router.post('/', protect, authorize('admin'), ctrl.create);

/**
 * @swagger
 * /api/stations/{id}:
 *   put:
 *     summary: Update a police station (admin only)
 *     tags: [Police Stations]
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
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Station updated
 */
router.put('/:id', protect, authorize('admin'), ctrl.update);

/**
 * @swagger
 * /api/stations/{id}:
 *   delete:
 *     summary: Delete a police station (admin only)
 *     tags: [Police Stations]
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
 *         description: Station deleted
 */
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;
