const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoriteCurrencyPair = sequelize.define('FavoriteCurrencyPair', {
  baseCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetCurrency: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.sync();

module.exports = FavoriteCurrencyPair;
