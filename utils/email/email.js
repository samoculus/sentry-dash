var sendgrid = require('@sendgrid/mail');
var params = require('../../params/params');

var sendVerification = async (user, token) => {
    sendgrid.setApiKey(params.sendgrid_key);
    const message = {
        to: user.email,
        from: 'EMAIL_HERE',
        templateId: 'TEMPLATE_ID_HERE',
        personalizations: [
            {
                to: [{email: user.email}],
                dynamic_template_data: {
                    name: user.firstName,
                    url: 'http://localhost:3000/api/verification/' + token
                },
            },
        ],
    };

    (async () => {
        try {
            await sendgrid.send(message);
        } catch (err) {
            console.log(err);
        }
    })(); 
};

var sendReset = async (user, token) => {
    sendgrid.setApiKey(params.sendgrid_key);
    const message = {
        to: user.email,
        from: 'EMAIL_HERE',
        templateId: 'TEMPLATE_ID_HERE',
        personalizations: [
            {
                to: [{email: user.email}],
                dynamic_template_data: {
                    url: 'http://localhost:3000/reset/' + token
                },
            },
        ],
    };

    (async () => {
        try {
            await sendgrid.send(message);
        } catch (err) {
            console.log(err);
        }
    })(); 
};

module.exports = {
    sendVerification,
    sendReset
};