const express = require('express');
const router = express.Router();
const raceController = require('../../controllers/raceController');

router.post('/races', raceController.createRaceSession);
router.get('/races', raceController.getRaceSessions);
router.put('/races/:id', raceController.updateRaceSession);
router.delete('/races/:id', raceController.deleteRaceSession);
router.post('/races/:id/drivers', raceController.addDriverToRace);
router.get('/races/:id/drivers', raceController.getDriversForRace);
router.delete('/races/:raceId/drivers/:driverId', raceController.deleteDriverFromRace);

module.exports = router;
