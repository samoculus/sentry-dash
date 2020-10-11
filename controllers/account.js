const { 
    updateEmail, 
    getAccInfo, 
    updatePayment,
    cancelSubscription,
    resubscribe } = require("../services/account");

const postEmail = async (req, res, next) => {
    const user = req.user;
    let email = req.body.email;

    try {
        let status = await updateEmail(user, email);

        switch(status.status){
          case 'Success':
            req.flash('info', 'Email updated');
            return res.redirect('/account');
          case 'Registered':
            req.flash('error', 'Email already registered.');
            return res.redirect('/account');
          case 'Validate':
            req.flash('error', 'Invalid email format.');
            return res.redirect('/account');
          case 'Failed':
            req.flash('error', 'Failed to update email');
            return res.redirect('/account');
        };

    } catch(err){
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    }
};

const postAccInfo = async (req, res, next) => {
    let user = req.user;

    try {
        let info = await getAccInfo(user);

        return res.render('account', {
            date: info.date, 
            status: info.status,
            cancel_status: info.cancel_status
        });

    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    }
};

const postupdatePayment = async (req, res, next) => {
    let paymentObj = {
        email: req.body.email,
        paymentMethodID: req.body.paymentMethodId,
        last4: req.body.last4,
        brand: req.body.brand
    };

    try {
        let response = await updatePayment(paymentObj);
        
        return res.json( response );

    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    }
};

const postcancelSubscription = async (req, res, next) => {
    let user = req.user;

    try {
        let response = await cancelSubscription(user);

        if(response.error != undefined){
            req.flash('error', 'An error occured. Try again shortly.')
            return res.redirect('/account');;
        };
        
        req.flash('info', response.status );
        return res.redirect('/account');

    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    };
};

const postResubscribe = async (req, res, next) => {
    let user = req.user;

    try {
        let response = await resubscribe(user);

        if(response.error != undefined){
            req.flash('error', 'An error occured. Try again shortly.')
            return res.redirect('/account');;
        };

        req.flash('info', response.status );
        return res.redirect('/account');
    } catch {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    };
};

module.exports = {
    postEmail,
    postAccInfo,
    postupdatePayment,
    postcancelSubscription,
    postResubscribe
};