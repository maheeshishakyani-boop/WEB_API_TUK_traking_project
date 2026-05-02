// ================================================
// VEHICLE CONTROLLER
// ================================================
const { Op } = require('sequelize');
const { Vehicle, District, Province } = require('../models');

// GET /api/vehicles?district_id=1&province_id=1&status=active&search=ABC&page=1&limit=20
exports.getAll = async (req, res, next) => {
  try {
    const { district_id, province_id, status, search, page = 1, limit = 20 } = req.query;

    const where = {};
    if (district_id) where.district_id = district_id;
    if (status)      where.status = status;
    if (search) {
      where[Op.or] = [
        { registration_number: { [Op.like]: `%${search}%` } },
        { driver_name: { [Op.like]: `%${search}%` } },
        { driver_nic: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by province (through district relationship)
    const districtWhere = {};
    if (province_id) districtWhere.province_id = province_id;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Vehicle.findAndCountAll({
      where,
      include: [{
        model: District, as: 'district',
        where: Object.keys(districtWhere).length ? districtWhere : undefined,
        include: [{ model: Province, as: 'province', attributes: ['id', 'name'] }]
      }],
      limit:  parseInt(limit),
      offset,
      order:  [['registration_number', 'ASC']]
    });

    res.json({
      success: true,
      count,
      page:        parseInt(page),
      totalPages:  Math.ceil(count / parseInt(limit)),
      data:        rows
    });
  } catch (error) { next(error); }
};

// GET /api/vehicles/:id
exports.getOne = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [{
        model: District, as: 'district',
        include: [{ model: Province, as: 'province' }]
      }]
    });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) { next(error); }
};

// POST /api/vehicles
exports.create = async (req, res, next) => {
  try {
    const { registration_number, driver_name, driver_phone, driver_nic, district_id, device_id } = req.body;
    if (!registration_number || !driver_name || !district_id) {
      return res.status(400).json({
        success: false,
        message: 'registration_number, driver_name, and district_id are required'
      });
    }
    const vehicle = await Vehicle.create({
      registration_number, driver_name, driver_phone, driver_nic, district_id, device_id
    });
    res.status(201).json({ success: true, message: 'Vehicle registered successfully', data: vehicle });
  } catch (error) { next(error); }
};

// PUT /api/vehicles/:id
exports.update = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    await vehicle.update(req.body);
    res.json({ success: true, message: 'Vehicle updated', data: vehicle });
  } catch (error) { next(error); }
};

// DELETE /api/vehicles/:id  (soft delete - just marks as inactive)
exports.remove = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    await vehicle.update({ status: 'inactive' });
    res.json({ success: true, message: 'Vehicle deactivated successfully' });
  } catch (error) { next(error); }
};
