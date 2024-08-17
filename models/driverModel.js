// models/driverModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Driver = sequelize.define('Driver', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  carNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fastestLap: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = Driver;
