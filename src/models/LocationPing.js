// ================================================
// LOCATION PING MODEL
// Every time a tuk-tuk sends its GPS location,
// it gets saved here. This table will be VERY large.
// ================================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LocationPing = sequelize.define('LocationPing', {
  id: {
    type: DataTypes.BIGINT,   // BIGINT because this table will have millions of rows
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  latitude: {
    // e.g. 6.9271 (Sri Lanka is between 5.9 and 9.9 north)
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: { args: [-90], msg: 'Invalid latitude' },
      max: { args: [90],  msg: 'Invalid latitude' }
    }
  },
  longitude: {
    // e.g. 79.8612 (Sri Lanka is between 79.5 and 82.0 east)
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: { args: [-180], msg: 'Invalid longitude' },
      max: { args: [180],  msg: 'Invalid longitude' }
    }
  },
  speed_kmh: {
    type: DataTypes.FLOAT,
    allowNull: true   // optional: speed in km/h
  },
  heading: {
    type: DataTypes.FLOAT,
    allowNull: true   // optional: direction in degrees (0=North, 90=East, etc.)
  },
  pinged_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW  // automatically saves current time
  }
}, {
  tableName: 'location_pings',
  timestamps: false,   // we manage time ourselves with pinged_at
  indexes: [
    { fields: ['vehicle_id'] },           // speeds up lookup by vehicle
    { fields: ['pinged_at'] },            // speeds up time range queries
    { fields: ['vehicle_id', 'pinged_at'] } // speeds up history queries
  ]
});

module.exports = LocationPing;
