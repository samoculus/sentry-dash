const express = require('express');
const ensureLoggedIn = require('../../utils/auth/authLoggedIn').ensureLoggedIn;
const ensureSub = require('../../utils/auth/authSubscribed').ensureSubscribed;

const router = express.Router();

router.use(ensureLoggedIn);
router.use(ensureSub);

router.get('/', (req, res) => { res.render('dashboard'); });

module.exports = router;