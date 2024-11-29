const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createCurrency, getCurrencies } = require('../controllers/currencyController');

router.post('/create', auth, createCurrency);
router.get('/', auth, getCurrencies);

module.exports = router;