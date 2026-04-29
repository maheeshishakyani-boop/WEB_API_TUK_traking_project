// ================================================
// USER MODEL - Police officers, admins, and tuk-tuk devices
// role: admin = full access
// role: officer = view only
// role: device = send GPS pings only
// ================================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: { msg: 'Name cannot be empty' } }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please enter a valid email address' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'officer', 'device'),
    allowNull: false,
    defaultValue: 'officer'
  },
  police_station_id: {
    type: DataTypes.INTEGER,
    allowNull: true   // admins may not belong to a specific station
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
