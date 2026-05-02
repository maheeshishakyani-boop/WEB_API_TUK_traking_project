// ================================================
// DISTRICT CONTROLLER
// ================================================
const { District, Province, PoliceStation } = require('../models');

// GET /api/districts?province_id=1
exports.getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.province_id) where.province_id = req.query.province_id;

    const districts = await District.findAll({
      where,
      include: [{ model: Province, as: 'province', attributes: ['id', 'name', 'code'] }],
      order: [['name', 'ASC']]
    });
    res.json({ success: true, count: districts.length, data: districts });
  } catch (error) { next(error); }
};

// GET /api/districts/:id
exports.getOne = async (req, res, next) => {
  try {
    const district = await District.findByPk(req.params.id, {
      include: [
        { model: Province, as: 'province' },
        { model: PoliceStation, as: 'stations', attributes: ['id', 'name', 'phone'] }
      ]
    });
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }
    res.json({ success: true, data: district });
  } catch (error) { next(error); }
};

// POST /api/districts
exports.create = async (req, res, next) => {
  try {
    const { name, province_id } = req.body;
    if (!name || !province_id) {
      return res.status(400).json({ success: false, message: 'Name and province_id are required' });
    }
    const district = await District.create({ name, province_id });
    res.status(201).json({ success: true, message: 'District created', data: district });
  } catch (error) { next(error); }
};

// PUT /api/districts/:id
exports.update = async (req, res, next) => {
  try {
    const district = await District.findByPk(req.params.id);
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }
    await district.update(req.body);
    res.json({ success: true, message: 'District updated', data: district });
  } catch (error) { next(error); }
};

// DELETE /api/districts/:id
exports.remove = async (req, res, next) => {
  try {
    const district = await District.findByPk(req.params.id);
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }
    await district.destroy();
    res.json({ success: true, message: 'District deleted successfully' });
  } catch (error) { next(error); }
};
