const express = require('express');

const router = express.Router();

router.use('/users', require('./users'));
router.use('/verification', require('./verification'));
router.use('/reset-password', require('./reset-pass'));
router.use('/create-customer', require('./create-customer'));
router.use('/account', require('./account/account-api.js'));

module.exports = router;