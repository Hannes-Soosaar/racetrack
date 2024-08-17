// config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Sequelize with SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // File path to the SQLite database
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected');
  } catch (error) {
    console.error('SQLite connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { sequelize, connectDB };
