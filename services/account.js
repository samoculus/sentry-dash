const { findUser, findbyEmail} = require('../db/index');
var validate = require('../utils/auth/validate');
var params = require('../params/params');
var stripe = require('stripe')(params.stripe_skey);

// Updates user email
const updateEmail = async (user, email) => {
    var userDB = await findUser(user._id);
    let database_check = await findbyEmail(email);
    let validate_status = validate.ValidateEmail(email);

    if (validate_status == true && userDB.email != email) {

        userDB.email = email;

        try {
            await userDB.save();
            return {status: 'Success'};
        } catch (err){
            console.log(err);
            return {status: 'Failed'};
        }
    } else if (validate_status == false){
        return {status: 'Validate'};
    } else if (database_check != []){
        return {status: 'Registered'};
    } else {
        return {Status: 'Failed'}
    };
};

// Gets users account info. For use before accounts dashboard renders.
const getAccInfo = async (user) => {
    
    let userDB = await findbyEmail(user.email);
    const subscription = await stripe.subscriptions.retrieve(user.subscriptionID);
    let date;
    let status;
    let cancel_status;

    if( subscription.status != 'canceled' ){
        let ts;
        if ( subscription.trial_end != null ){
            ts = new Date(subscription.trial_end * 1000);
            ts = ts.toUTCString().split(' ');
            date = (ts[1] + ' ' + ts[2] + ' ' + ts[3] );
        } else {
            ts = new Date(subscription.current_period_end * 1000);
            ts = ts.toUTCString().split(' ');
            date = (ts[1] + ' ' + ts[2] + ' ' + ts[3] );
        };
        status = subscription.status;
        cancel_status = subscription.cancel_at_period_end;
    } else {
        status = 'Canceled'
        date = '*'
        cancel_status = true;
    };

    if ( status == 'trialing' || status == 'active' ){
        userDB[0].subscriptionStatus = true;
        await userDB[0].save()
    } else {
        userDB[0].subscriptionStatus = false;
        await userDB[0].save()
    };

    return {
        status: status,
        date: date,
        cancel_status: cancel_status
    };
};

// Updates users payment method.
const updatePayment = async (paymentOBJ) => {
    let userDB = await findbyEmail(paymentOBJ.email);

    let newPayment = await stripe.paymentMethods.attach(
        paymentOBJ.paymentMethodID,
        { customer: userDB[0].stripeID }
    ).then((newPayment) => {
        return newPayment
    }).catch((err) => {
        switch (err.type) {
            case 'StripeCardError':
              // A declined card error
              return { error: 'Card declined. Try another card!' };
            case 'StripeRateLimitError':
              // Too many requests made to the API too quickly
              return {error: 'Rate limit error. Please only press register once.'};
            case 'StripeInvalidRequestError':
              // Invalid parameters were supplied to Stripe's API
              return {error: 'Missing fields!'};
            case 'StripeAPIError':
              // An error occurred internally with Stripe's API
              return { error: 'An error occured please try again.' };
            case 'StripeConnectionError':
              // Some kind of error occurred during the HTTPS communication
              return {error: 'An error occured please try again.'};
            case 'StripeAuthenticationError':
              // You probably used an incorrect API key
              return { error: 'An error occured please try again.' };
            default:
              // Handle any other types of unexpected errors
              return {error: 'An error occured please try again.'};
          };
    });

    if(newPayment.error != undefined){
        return {error: newPayment.error};
    };

    const oldPayment =  await stripe.paymentMethods.detach(
        userDB[0].paymentID
    ).then((oldPayment) => {
        return oldPayment;
    }).catch((err) => {
        return {error: err.type};
    });

    if(oldPayment.error != undefined){
        return {error: oldPayment.error};
    };

    const customer = await stripe.customers.update(
        userDB[0].stripeID,
        { invoice_settings: {
            default_payment_method: paymentOBJ.paymentMethodID 
          }
        }
    ).then((customer) => {
        return customer;
    }).catch((err) => {
        return {error: err.type};
    });

    if(customer.error != undefined){
        return {error: customer.error};
    };

    userDB[0].paymentID = paymentOBJ.paymentMethodID;
    userDB[0].last4 = paymentOBJ.last4;
    userDB[0].brand = paymentOBJ.brand;

    await userDB[0].save();

    return { status: 'Success. Payment updated!'}
};

const cancelSubscription = async (user) => {
    let subID = user.subscriptionID;

    const cancel = await stripe.subscriptions.update(
        subID,
        { cancel_at_period_end: true }
    ).then((cancel) => {
        return cancel;
    }).catch((err) => {
        return {error: err.type};
    });
    
    if(cancel.error != undefined){
        return {error: cancel.error};
    };

    return { status: 'Success. Subscription canceled!' };
};

const resubscribe = async (user) => {
    var userDB = await findUser(user._id);
    let subID = user.subscriptionID;

    const resubscribe = await stripe.subscriptions.update(
        subID,
        { cancel_at_period_end: false }
    ).then((resuscribe) => {
        return resuscribe;
    }).catch((err) => {
        return {error: err.type};
    });

    if ( resubscribe.error != undefined ) {
        const subscription = await stripe.subscriptions.create({
            customer: user.stripeID,
            items: [{
              plan: params.stripePlan
            }],
            trial_from_plan: false
        }).then((subscription) => {
             return subscription;
        }).catch((err) => {
            return {error: err.type};
        });

        if (subscription.error != undefined) {
            return { error: subscription.error }
        };

        userDB.subscriptionID = subscription.id;
        userDB.save();

        return { status: 'Successfully resubscribed!' }
    };

    return { status: 'Successfully resubscribed!' }
};

module.exports = {
    updateEmail,
    getAccInfo,
    updatePayment,
    cancelSubscription,
    resubscribe
};