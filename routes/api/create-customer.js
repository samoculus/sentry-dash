const express = require('express');
const register = require('../../controllers/register');

const router = express.Router();

router.post('/', register.postCustomer);

module.exports = router;