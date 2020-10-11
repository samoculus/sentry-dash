const express = require('express');

const router = express.Router();

//TODO: Add in error & info

router.use( (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');

    next();
});

router.use('/dashboard', require('./dashboard'));
router.use('/account', require('./account'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/register', require('./register'));
router.use('/resend', require('./resend'));
router.use('/forgot', require('./forgot'));
router.use('/reset', require('./reset'));


module.exports = router;