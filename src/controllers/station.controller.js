// ================================================
// POLICE STATION CONTROLLER
// ================================================
const { PoliceStation, District, Province } = require('../models');

// GET /api/stations?district_id=2
exports.getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.district_id) where.district_id = req.query.district_id;

    const stations = await PoliceStation.findAll({
      where,
      include: [{
        model: District, as: 'district',
        include: [{ model: Province, as: 'province', attributes: ['id', 'name'] }]
      }],
      order: [['name', 'ASC']]
    });
    res.json({ success: true, count: stations.length, data: stations });
  } catch (error) { next(error); }
};

// GET /api/stations/:id
exports.getOne = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByPk(req.params.id, {
      include: [{
        model: District, as: 'district',
        include: [{ model: Province, as: 'province' }]
      }]
    });
    if (!station) {
      return res.status(404).json({ success: false, message: 'Police station not found' });
    }
    res.json({ success: true, data: station });
  } catch (error) { next(error); }
};

// POST /api/stations
exports.create = async (req, res, next) => {
  try {
    const { name, district_id, address, phone } = req.body;
    if (!name || !district_id) {
      return res.status(400).json({ success: false, message: 'Name and district_id are required' });
    }
    const station = await PoliceStation.create({ name, district_id, address, phone });
    res.status(201).json({ success: true, message: 'Police station created', data: station });
  } catch (error) { next(error); }
};

// PUT /api/stations/:id
exports.update = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByPk(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Police station not found' });
    }
    await station.update(req.body);
    res.json({ success: true, message: 'Station updated', data: station });
  } catch (error) { next(error); }
};

// DELETE /api/stations/:id
exports.remove = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByPk(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Police station not found' });
    }
    await station.destroy();
    res.json({ success: true, message: 'Station deleted successfully' });
  } catch (error) { next(error); }
};
