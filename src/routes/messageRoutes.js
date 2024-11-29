const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendMessage, getMessages } = require('../controllers/messageController');

router.post('/send', auth, sendMessage);
router.get('/', auth, getMessages);

module.exports = router;