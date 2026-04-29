// ================================================
// VEHICLE MODEL - Represents a registered tuk-tuk
// ================================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registration_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: { notEmpty: { msg: 'Registration number cannot be empty' } }
  },
  driver_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: { msg: 'Driver name cannot be empty' } }
  },
  driver_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  driver_nic: {
    // NIC = National Identity Card number
    type: DataTypes.STRING(20),
    allowNull: true
  },
  district_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  device_id: {
    // Unique ID of the GPS device installed in the tuk-tuk
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  }
}, {
  tableName: 'vehicles',
  timestamps: true
});

module.exports = Vehicle;
