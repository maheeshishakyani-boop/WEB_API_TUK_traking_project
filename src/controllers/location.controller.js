// ================================================
// LOCATION CONTROLLER
// ================================================
const { Op } = require('sequelize');
const { LocationPing, Vehicle, District, Province } = require('../models');

// POST /api/locations/ping  (tuk-tuk sends its GPS location)
exports.ping = async (req, res, next) => {
  try {
    const { vehicle_id, latitude, longitude, speed_kmh, heading } = req.body;

    if (!vehicle_id || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'vehicle_id, latitude, and longitude are required'
      });
    }

    // Check vehicle exists and is active
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    if (vehicle.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Vehicle is ${vehicle.status}. Cannot accept location ping.`
      });
    }

    const ping = await LocationPing.create({
      vehicle_id, latitude, longitude,
      speed_kmh: speed_kmh || null,
      heading:   heading   || null,
      pinged_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Location recorded successfully',
      data: ping
    });
  } catch (error) { next(error); }
};

// GET /api/locations/:vehicle_id/latest
exports.getLatest = async (req, res, next) => {
  try {
    const { vehicle_id } = req.params;

    const vehicle = await Vehicle.findByPk(vehicle_id, {
      include: [{ model: District, as: 'district', include: [{ model: Province, as: 'province' }] }]
    });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const latest = await LocationPing.findOne({
      where: { vehicle_id },
      order: [['pinged_at', 'DESC']]
    });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: 'No location data found for this vehicle'
      });
    }

    res.json({ success: true, data: { vehicle, latest_location: latest } });
  } catch (error) { next(error); }
};

// GET /api/locations/:vehicle_id/history?start_date=2025-01-01&end_date=2025-01-07&page=1&limit=100
exports.getHistory = async (req, res, next) => {
  try {
    const { vehicle_id } = req.params;
    const { start_date, end_date, page = 1, limit = 100 } = req.query;

    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Build time filter
    const where = { vehicle_id };
    if (start_date || end_date) {
      where.pinged_at = {};
      if (start_date) where.pinged_at[Op.gte] = new Date(start_date);
      if (end_date)   where.pinged_at[Op.lte] = new Date(end_date);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await LocationPing.findAndCountAll({
      where,
      order:  [['pinged_at', 'DESC']],
      limit:  parseInt(limit),
      offset
    });

    res.json({
      success: true,
      vehicle,
      count,
      page:        parseInt(page),
      totalPages:  Math.ceil(count / parseInt(limit)),
      data:        rows
    });
  } catch (error) { next(error); }
};

// GET /api/locations/live?district_id=1&province_id=1
// Returns all active vehicles with their LATEST location
exports.getLiveAll = async (req, res, next) => {
  try {
    const { district_id, province_id } = req.query;

    // Build filters
    const vehicleWhere = { status: 'active' };
    if (district_id) vehicleWhere.district_id = district_id;

    const districtWhere = {};
    if (province_id) districtWhere.province_id = province_id;

    const vehicles = await Vehicle.findAll({
      where: vehicleWhere,
      include: [{
        model: District, as: 'district',
        where: Object.keys(districtWhere).length ? districtWhere : undefined,
        include: [{ model: Province, as: 'province', attributes: ['id', 'name'] }]
      }]
    });

    // For each vehicle, get latest ping
    const results = await Promise.all(
      vehicles.map(async (v) => {
        const latest = await LocationPing.findOne({
          where: { vehicle_id: v.id },
          order: [['pinged_at', 'DESC']]
        });
        return {
          vehicle:          v,
          latest_location:  latest || null
        };
      })
    );

    res.json({
      success: true,
      count:   results.length,
      data:    results
    });
  } catch (error) { next(error); }
};
