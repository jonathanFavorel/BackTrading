const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createTradingAccount, getTradingAccounts, getTradingAccountStats } = require('../controllers/tradingAccountController');

router.post('/create', auth, createTradingAccount);
router.get('/', auth, getTradingAccounts);
router.get('/stats/:id', auth, getTradingAccountStats);

module.exports = router;