const { findbyEmail } = require('../../db/index');
var params = require('../../params/params');
var stripe = require('stripe')(params.stripe_skey);

var updateSubStatus = async (req, res, next) => {

    let userDB = await findbyEmail(user.email);
    const subscription = await  stripe.subscriptions.retrieve(user.subscriptionID);
    let ts = new Date(subscription.trial_end * 1000);
    ts = ts.toUTCString().split(' ');
    let date = (ts[1] + ' ' + ts[2] + ' ' + ts[3] );
    let status = subscription.status;
    
    if ( status == 'trialing' || status == 'active' ){
        userDB[0].subscriptionStatus = true;
        await userDB[0].save()
    } else {
        userDB[0].subscriptionStatus = false;
        await userDB[0].save()
    };
};

module.exports = {
    updateSubStatus
};