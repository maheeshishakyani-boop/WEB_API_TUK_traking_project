// ================================================
// PROVINCE MODEL - Represents a province table in MySQL
// Sri Lanka has 9 provinces
// ================================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Province = sequelize.define('Province', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { notEmpty: { msg: 'Province name cannot be empty' } }
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: { notEmpty: { msg: 'Province code cannot be empty' } }
  }
}, {
  tableName: 'provinces',
  timestamps: true   // adds createdAt and updatedAt columns
});

module.exports = Province;
