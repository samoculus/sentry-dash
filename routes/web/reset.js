const reset = require('../../controllers/reset-pass');
const express = require('express');

const router = express.Router();

router.get('/:token', reset.getReset);

module.exports = router;