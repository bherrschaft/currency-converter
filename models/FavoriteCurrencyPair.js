// Import the DataTypes object from the sequelize library
const { DataTypes } = require('sequelize');

// Import the configured sequelize instance from the database configuration file
const sequelize = require('../config/database');

// Define a new model called 'FavoriteCurrencyPair'
const FavoriteCurrencyPair = sequelize.define('FavoriteCurrencyPair', {
  // Define a 'baseCurrency' field of type STRING, which cannot be null
  baseCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Define a 'targetCurrency' field of type STRING, which cannot be null
  targetCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync all defined models to the database, creating the 'FavoriteCurrencyPair' table if it doesn't exist
sequelize.sync();

// Export the 'FavoriteCurrencyPair' model for use in other parts of the application
module.exports = FavoriteCurrencyPair;
