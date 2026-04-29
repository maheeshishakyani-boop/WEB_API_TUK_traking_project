// ================================================
// POLICE STATION MODEL
// Each station belongs to a district
// ================================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PoliceStation = sequelize.define('PoliceStation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: { msg: 'Station name cannot be empty' } }
  },
  district_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'police_stations',
  timestamps: true
});

module.exports = PoliceStation;
