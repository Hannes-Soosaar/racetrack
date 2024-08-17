// controllers/driverController.js
const Driver = require('../models/driverModel');

exports.createDriver = async (req, res) => {
  try {
    const { name, carNumber } = req.body;
    const newDriver = await Driver.create({ name, carNumber });
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ message: 'Error creating driver', error });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error });
  }
};
