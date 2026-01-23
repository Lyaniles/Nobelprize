const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const nobelRoutes = require('./routes/nobelRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve Static Files (The GUI)
app.use(express.static(path.join(__dirname, '../public')));

// Simple Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Info route
app.get('/', (req, res) => {
  res.json({
    name: 'Nobel Prize Wrapper API',
    version: '1.0.0',
    endpoints: {
      prizes: '/api/prizes',
      laureates: '/api/laureates'
    }
  });
});

// Routes
app.use('/api', nobelRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
