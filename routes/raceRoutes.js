// routes/raceRoutes.js
const express = require('express');
const router = express.Router();
const raceController = require('../controllers/raceController');

router.post('/races', raceController.createRaceSession);
router.get('/races', raceController.getRaceSessions);

module.exports = router;
