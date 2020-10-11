// Middleware to check if user is subscribed.
var params = require('../../params/params');
var stripe = require('stripe')(params.stripe_skey);

var ensureSubscribed = async function ensureAuthentication(req, res, next){
    let user = req.user;

    if(req.isAuthenticated() && user.subscriptionStatus == true ){
        next();
    } else {
        req.flash('error', 'Subscribe for access.');
        res.redirect('/account');
    }
}

module.exports = {ensureSubscribed: ensureSubscribed}