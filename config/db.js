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

// TODO: When do we close the DB connection ?

// Create the drivers table if it doesn't exist
// db.run(`
//     CREATE TABLE IF NOT EXISTS drivers (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         carNumber TEXT NOT NULL,
//         createdAt TEXT NOT NULL,
//         updatedAt TEXT NOT NULL
//     )
// `, (err) => {
//     if (err) {
//         console.error('Error creating drivers table:', err.message);
//     } else {
//         console.log('Drivers table ready');
//     }
// });

module.exports = db;
