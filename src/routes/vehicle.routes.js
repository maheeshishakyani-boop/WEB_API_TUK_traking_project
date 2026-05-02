// ================================================
// VEHICLE ROUTES
// ================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/vehicle.controller');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Tuk-tuk vehicle registration and management
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles with filtering, search and pagination
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: district_id
 *         schema:
 *           type: integer
 *         description: Filter by district ID
 *       - in: query
 *         name: province_id
 *         schema:
 *           type: integer
 *         description: Filter by province ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         description: Filter by vehicle status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by registration number or driver name
 *         example: "ABC"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of vehicles
 */
router.get('/', protect, ctrl.getAll);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a single vehicle by ID
 *     tags: [Vehicles]
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
 *         description: Vehicle data
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', protect, ctrl.getOne);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Register a new tuk-tuk vehicle (admin only)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registration_number, driver_name, district_id]
 *             properties:
 *               registration_number:
 *                 type: string
 *                 example: "WP CAB-1234"
 *               driver_name:
 *                 type: string
 *                 example: "Kamal Perera"
 *               driver_phone:
 *                 type: string
 *                 example: "0771234567"
 *               driver_nic:
 *                 type: string
 *                 example: "199012345678"
 *               district_id:
 *                 type: integer
 *                 example: 1
 *               device_id:
 *                 type: string
 *                 example: "DEV-001"
 *     responses:
 *       201:
 *         description: Vehicle registered successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', protect, authorize('admin'), ctrl.create);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update vehicle details (admin only)
 *     tags: [Vehicles]
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
 *               driver_name:
 *                 type: string
 *               driver_phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', protect, authorize('admin'), ctrl.update);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Deactivate a vehicle (admin only) - does not delete, just marks inactive
 *     tags: [Vehicles]
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
 *         description: Vehicle deactivated
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;
