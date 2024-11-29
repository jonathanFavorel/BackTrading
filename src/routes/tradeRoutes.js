const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createTrade, getTrades } = require('../controllers/tradeController');

router.post('/create', auth, createTrade);
router.get('/', auth, getTrades);

module.exports = router;