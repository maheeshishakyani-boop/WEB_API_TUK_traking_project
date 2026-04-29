// ================================================
// MODELS/INDEX.JS
// This file loads all models and sets up
// how they relate to each other (like foreign keys)
// ================================================
const Province      = require('./Province');
const District      = require('./District');
const PoliceStation = require('./PoliceStation');
const User          = require('./User');
const Vehicle       = require('./Vehicle');
const LocationPing  = require('./LocationPing');

// ----------------------------------------
// RELATIONSHIPS (who belongs to who)
// ----------------------------------------

// Province has many Districts
Province.hasMany(District, { foreignKey: 'province_id', as: 'districts' });
District.belongsTo(Province, { foreignKey: 'province_id', as: 'province' });

// District has many Police Stations
District.hasMany(PoliceStation, { foreignKey: 'district_id', as: 'stations' });
PoliceStation.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

// District has many Vehicles
District.hasMany(Vehicle, { foreignKey: 'district_id', as: 'vehicles' });
Vehicle.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

// Police Station has many Users (officers)
PoliceStation.hasMany(User, { foreignKey: 'police_station_id', as: 'users' });
User.belongsTo(PoliceStation, { foreignKey: 'police_station_id', as: 'station' });

// Vehicle has many Location Pings
Vehicle.hasMany(LocationPing, { foreignKey: 'vehicle_id', as: 'pings' });
LocationPing.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

module.exports = { Province, District, PoliceStation, User, Vehicle, LocationPing };
