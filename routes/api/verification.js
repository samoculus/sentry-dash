const verify = require('../../controllers/verification')
const express = require('express');

const router = express.Router();

router.get('/:token', verify.verifyAPI);

module.exports = router;