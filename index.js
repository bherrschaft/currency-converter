// Import the express module
const express = require('express');
// Import the path module for working with file and directory paths
const path = require('path');
// Import the body-parser module for parsing incoming request bodies
const bodyParser = require('body-parser');
// Import the configured sequelize instance from the database configuration file
const sequelize = require('./config/database');
// Import the FavoriteCurrencyPair model
const FavoriteCurrencyPair = require('./models/FavoriteCurrencyPair');

const cors = require('cors');

// Create an Express application
const app = express();
// Define the port number the server will listen on
const port = 3000;

app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define a route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define a POST route to save a favorite currency pair
app.post('/favorite', async (req, res) => {
  try {
    const { baseCurrency, targetCurrency } = req.body;
    // Create a new favorite currency pair in the database
    const favorite = await FavoriteCurrencyPair.create({ baseCurrency, targetCurrency });
    // Respond with the created favorite currency pair and status 201
    res.status(201).json(favorite);
  } catch (error) {
    // Respond with an error message and status 500 if an error occurs
    res.status(500).json({ error: error.message });
  }
});

// Define a GET route to retrieve all favorite currency pairs
app.get('/favorites', async (req, res) => {
  try {
    // Find all favorite currency pairs in the database
    const favorites = await FavoriteCurrencyPair.findAll();
    // Respond with the list of favorite currency pairs and status 200
    res.status(200).json(favorites);
  } catch (error) {
    // Respond with an error message and status 500 if an error occurs
    res.status(500).json({ error: error.message });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
