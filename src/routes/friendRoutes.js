const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addFriend, getFriends } = require('../controllers/friendController');

router.post('/add', auth, addFriend);
router.get('/', auth, getFriends);

module.exports = router;