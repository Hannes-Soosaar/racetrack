const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.post('/drivers', driverController.createDriver);
router.get('/drivers', driverController.getDrivers);

module.exports = router;
