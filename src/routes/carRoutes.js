const express = require('express');
const router = express.Router();
const carController = require('../../controllers/carController');  // Ensure correct path to your controller

// Get all cars for a specific race
router.get('/races/:raceId/cars', carController.getCarsForRace);

module.exports = router;
