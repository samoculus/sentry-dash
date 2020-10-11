const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => { res.render('login'); } );

// Add middleware. When logged in should only check database.

router.post('/', passport.authenticate('login', {
    successRedirect:'/account',
    failureRedirect:'/login',
    failureFlash: true
}));

module.exports = router;