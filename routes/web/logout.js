const express = require('express');

const ensureLoggedIn = require('../../utils/auth/authLoggedIn').ensureLoggedIn;

const router = express.Router();
router.use(ensureLoggedIn);

router.get('/', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;