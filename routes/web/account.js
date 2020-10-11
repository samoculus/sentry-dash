const express = require('express');
const account = require('../../controllers/account');

const ensureLoggedIn = require('../../utils/auth/authLoggedIn').ensureLoggedIn;

const router = express.Router();

router.use(ensureLoggedIn);

router.get('/', account.postAccInfo);

module.exports = router;