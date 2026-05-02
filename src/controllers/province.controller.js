// ================================================
// PROVINCE CONTROLLER
// ================================================
const { Province, District } = require('../models');

// GET /api/provinces
exports.getAll = async (req, res, next) => {
  try {
    const provinces = await Province.findAll({
      include: [{ model: District, as: 'districts', attributes: ['id', 'name'] }],
      order: [['name', 'ASC']]
    });
    res.json({ success: true, count: provinces.length, data: provinces });
  } catch (error) { next(error); }
};

// GET /api/provinces/:id
exports.getOne = async (req, res, next) => {
  try {
    const province = await Province.findByPk(req.params.id, {
      include: [{ model: District, as: 'districts' }]
    });
    if (!province) {
      return res.status(404).json({ success: false, message: 'Province not found' });
    }
    res.json({ success: true, data: province });
  } catch (error) { next(error); }
};

// POST /api/provinces
exports.create = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }
    const province = await Province.create({ name, code });
    res.status(201).json({ success: true, message: 'Province created', data: province });
  } catch (error) { next(error); }
};

// PUT /api/provinces/:id
exports.update = async (req, res, next) => {
  try {
    const province = await Province.findByPk(req.params.id);
    if (!province) {
      return res.status(404).json({ success: false, message: 'Province not found' });
    }
    await province.update(req.body);
    res.json({ success: true, message: 'Province updated', data: province });
  } catch (error) { next(error); }
};

// DELETE /api/provinces/:id
exports.remove = async (req, res, next) => {
  try {
    const province = await Province.findByPk(req.params.id);
    if (!province) {
      return res.status(404).json({ success: false, message: 'Province not found' });
    }
    await province.destroy();
    res.json({ success: true, message: 'Province deleted successfully' });
  } catch (error) { next(error); }
};
