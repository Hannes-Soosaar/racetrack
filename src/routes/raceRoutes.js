const express = require('express');
const router = express.Router();
const raceController = require('../../controllers/raceController');


router.post('/races', raceController.createRaceSession);
router.get('/races', raceController.getRaceSessions);
router.put('/races/:id', raceController.updateRaceSession);
router.delete('/races/:id', raceController.deleteRaceSession);

module.exports = router;
