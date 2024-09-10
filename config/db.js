const sqlite3 = require('sqlite3').verbose();
const path = require('path');



// Open the database (this will create it if it doesn't exist)
const db = new sqlite3.Database(path.join(__dirname, '../src/db/racetrack.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

module.exports = db;
