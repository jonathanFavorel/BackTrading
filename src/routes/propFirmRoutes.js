const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPropFirm, getPropFirms } = require('../controllers/propFirmController');

router.post('/create', auth, createPropFirm);
router.get('/', auth, getPropFirms);

module.exports = router;