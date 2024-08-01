const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));

// Endpoint to handle data synchronization
app.post('/sync', (req, res) => {
  const data = req.body;
  console.log('Data received for synchronization:', data);
  // Handle data synchronization logic here, e.g., store to database
  res.json({ message: 'Data synchronized successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
