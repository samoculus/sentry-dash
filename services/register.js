const validate = require('../utils/auth/validate');
const { sendVerification } = require('../utils/email/email');
const { findUser, findbyEmail, createUser, createToken } = require('../db/index');

const params = require('../params/params');
const stripe = require('stripe')(params.stripe_skey);

const createCustomer = async (user) => {
    let emailValidation = validate.ValidateEmail(user.email.toLowerCase());
    let passwordValidation = validate.ValidatePassword(user.password);

    if(user.password.length == 0 || user.firstName.length == 0 || user.lastName.length == 0 || user.email.length == 0){
        return {error: 'Missing fields!'};
    };

    if(emailValidation == false){
        return {error: 'Incorrect email format.'};
    };

    if(passwordValidation == false){
        return {error: 'Password must contain 6 characters, uppercase, lowercase, & a digit.'};
    };

    let userDB = await findbyEmail(user.email);
    if (userDB.length > 0) {
        return {error: 'Email is already registered!'};
    };

    const customer = await stripe.customers.create({
        payment_method: user.paymentMethodID,
        email: user.email,
        invoice_settings: {
          default_payment_method: user.paymentMethodID,
        },
    }).then((customer) => {
        return customer;
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

    if(customer.error != undefined){
        return {error: customer.error};
    };

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        plan: params.stripePlan
      }],
      trial_from_plan: true
    });

    const newUser = await createUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        stripeID: customer.id,
        subscriptionID: subscription.id,
        paymentID: user.paymentMethodID,
        last4: user.last4,
        brand: user.brand
    });

    const token = await createToken({id: newUser._id});
    
    await sendVerification(newUser, token.token);
    
    return { subscription };
};

module.exports = {
    createCustomer
};