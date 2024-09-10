const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// Fetch drivers for a session
router.get('/sessions/:sessionId/drivers', (req, res) => {
    const sessionId = req.params.sessionId;
    const query = `SELECT * FROM drivers WHERE sessionId = ?`;
    db.all(query, [sessionId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Failed to load drivers' });
        } else {
            res.json(rows);
        }
    });
});

// Fetch available cars for a session (limit 8)
router.get('/sessions/:sessionId/available-cars', (req, res) => {
    const sessionId = req.params.sessionId;
    const query = `SELECT * FROM cars WHERE driver_id IS NULL AND sessionId = ? LIMIT 8`;
    db.all(query, [sessionId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Failed to load cars' });
        } else {
            res.json(rows);
        }
    });
});

// Fetch all race sessions
router.get('/sessions', (req, res) => {
    const query = 'SELECT * FROM race_sessions';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);  // Log the actual error
            return res.status(500).json({ error: 'Failed to load sessions' });
        }

        // Make sure to send the result as an array
        res.json(rows);  // Send the session data as JSON
    });
});


module.exports = router;
