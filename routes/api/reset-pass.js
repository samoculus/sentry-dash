const reset = require('../../controllers/reset-pass');
const express = require('express');

const router = express.Router();

router.post('/:token', reset.postReset);

module.exports = router;