const express = require('express');
const forgot = require('../../controllers/reset-pass');

const router = express.Router();

router.get('/', (req, res) => { res.render('forgot'); });

router.post('/', forgot.postForgot);

module.exports = router;