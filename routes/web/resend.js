const verify = require('../../controllers/verification')
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => { res.render('resend') });

router.post('/', verify.verifyResend);

module.exports = router;