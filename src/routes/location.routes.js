// ================================================
// LOCATION ROUTES
// ================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/location.controller');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: GPS location tracking - send pings and view history
 */

/**
 * @swagger
 * /api/locations/live:
 *   get:
 *     summary: Get ALL active vehicles with their latest location (live map view)
 *     tags: [Locations]
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
 *     responses:
 *       200:
 *         description: All vehicles with latest GPS coordinates
 */
router.get('/live', protect, ctrl.getLiveAll);

/**
 * @swagger
 * /api/locations/ping:
 *   post:
 *     summary: Send a GPS location ping (tuk-tuk device sends this)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicle_id, latitude, longitude]
 *             properties:
 *               vehicle_id:
 *                 type: integer
 *                 example: 1
 *               latitude:
 *                 type: number
 *                 example: 6.9271
 *                 description: "Sri Lanka: 5.9 to 9.9"
 *               longitude:
 *                 type: number
 *                 example: 79.8612
 *                 description: "Sri Lanka: 79.5 to 82.0"
 *               speed_kmh:
 *                 type: number
 *                 example: 35.5
 *               heading:
 *                 type: number
 *                 example: 180
 *                 description: "Direction in degrees (0=North, 90=East)"
 *     responses:
 *       201:
 *         description: Location recorded successfully
 *       404:
 *         description: Vehicle not found
 *       403:
 *         description: Vehicle is not active
 */
router.post('/ping', protect, ctrl.ping);

/**
 * @swagger
 * /api/locations/{vehicle_id}/latest:
 *   get:
 *     summary: Get latest GPS location for one vehicle
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Vehicle with latest GPS coordinates
 *       404:
 *         description: Vehicle or location not found
 */
router.get('/:vehicle_id/latest', protect, ctrl.getLatest);

/**
 * @swagger
 * /api/locations/{vehicle_id}/history:
 *   get:
 *     summary: Get movement history for a vehicle within a time range
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: "Start date (e.g. 2025-04-20)"
 *         example: "2025-04-20"
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: "End date (e.g. 2025-04-27)"
 *         example: "2025-04-27"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: Location history with pagination
 *       404:
 *         description: Vehicle not found
 */
router.get('/:vehicle_id/history', protect, ctrl.getHistory);

module.exports = router;
