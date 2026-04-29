// ================================================
// DISTRICT MODEL - Sri Lanka has 25 districts
// Each district belongs to one province
// ================================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const District = sequelize.define('District', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: { msg: 'District name cannot be empty' } }
  },
  province_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'districts',
  timestamps: true
});

module.exports = District;
