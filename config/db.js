const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the database file path
const dbPath = path.resolve(__dirname, '../database.sqlite');

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to the database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});

// Export the database connection
module.exports = db;
