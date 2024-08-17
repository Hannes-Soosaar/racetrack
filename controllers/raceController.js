// controllers/raceController.js
const RaceSession = require('../models/raceSessionModel');
const Driver = require('../models/driverModel');

exports.createRaceSession = async (req, res) => {
  try {
    const { sessionName, driverIds } = req.body;
    const drivers = await Driver.findAll({ where: { id: driverIds } });
    const newSession = await RaceSession.create({ sessionName });
    await newSession.addDrivers(drivers);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: 'Error creating race session', error });
  }
};

exports.getRaceSessions = async (req, res) => {
  try {
    const sessions = await RaceSession.findAll({ include: Driver });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching race sessions', error });
  }
};
