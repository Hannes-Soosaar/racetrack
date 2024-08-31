// src/routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../../controllers/carController');

router.get('/cars', carController.getCars);

module.exports = router;
