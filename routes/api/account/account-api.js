const express = require('express');

const account = require('../../../controllers/account');
const ensureLoggedIn = require('../../../utils/auth/authLoggedIn').ensureLoggedIn;

const router = express.Router()

router.use(ensureLoggedIn);

router.post('/update-email', account.postEmail);

router.post('/update-payment', account.postupdatePayment);

router.post('/cancel-subscription', account.postcancelSubscription);

router.post('/activate-subscription', account.postResubscribe);


module.exports = router;