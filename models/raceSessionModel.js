// models/raceSessionModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Driver = require('./driverModel');

const RaceSession = sequelize.define('RaceSession', {
  sessionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Define relationships
RaceSession.belongsToMany(Driver, { through: 'RaceDrivers' });
Driver.belongsToMany(RaceSession, { through: 'RaceDrivers' });

module.exports = RaceSession;
