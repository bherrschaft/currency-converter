const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const FavoriteCurrencyPair = require('./models/FavoriteCurrencyPair');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/favorite', async (req, res) => {
  try {
    const { baseCurrency, targetCurrency } = req.body;
    const favorite = await FavoriteCurrencyPair.create({ baseCurrency, targetCurrency });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/favorites', async (req, res) => {
  try {
    const favorites = await FavoriteCurrencyPair.findAll();
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
