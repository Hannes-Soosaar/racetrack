const express = require('express');
const router = express.Router();
const raceController = require('../../controllers/raceController');


router.post('/races', raceController.createRaceSession);
router.get('/races', raceController.getRaceSessions);
router.put('/races/:id', raceController.updateRaceSession);
router.delete('/races/:id', raceController.deleteRaceSession);
router.post('/races/:id/add-driver', raceController.addDriverToRace);
router.delete('/races/:id/remove-driver/:driverId', raceController.removeDriverFromRace);
router.get('/drivers/not-in-race/:id', raceController.getDriversNotInRace);

module.exports = router;
