const express = require('express');
const nobelService = require('../services/nobelService');

const router = express.Router();

// GET /api/prizes
router.get('/prizes', async (req, res) => {
  try {
    const data = await nobelService.getPrizes(req.query);
    res.json(data);
  } catch (error) {
    console.error(`Error in GET /prizes: ${error.message}`);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch prizes',
      message: error.message,
      details: error.response?.data || null
    });
  }
});

// GET /api/laureates
router.get('/laureates', async (req, res) => {
  try {
    const data = await nobelService.getLaureates(req.query);
    res.json(data);
  } catch (error) {
    console.error(`Error in GET /laureates: ${error.message}`);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch laureates',
      message: error.message,
      details: error.response?.data || null
    });
  }
});

module.exports = router;
