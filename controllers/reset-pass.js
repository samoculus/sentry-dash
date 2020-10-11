const { forgotPass, resetGET, resetPOST } = require('../services/reset-pass');

const postForgot = async (req, res, next) => {
    let email = req.body.email;

    try {
        let status = await forgotPass(email);

        switch(status.status){
            case 'Success':
                req.flash('info', 'Password reset sent')
                return res.redirect('/forgot')
            case 'None':
                req.flash('error', 'No user with this email');
                return res.redirect('/forgot');
            case 'Format':
                req.flash('error', 'Incorrect email format.');
                return res.redirect('/forgot');
            case 'Verify':
                req.flash('info', 'User not verified. <a href="/resend">Click here for a new link.</a>')
                return res.redirect('/forgot');
            case 'Token':
                req.flash('info', 'Email already sent. Check email.')
                return res.redirect('/forgot')
            default:
                req.flash('error', 'An error occured. Try again.');
                return res.redirect('/forgot');
        }
    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    };
};

const getReset = async (req, res, next) => {
    let token = req.params.token;

    try {
        let status = await resetGET(token);
        console.log(status);

        switch(status.status) {
            case 'Success':
                return res.render('reset', { token: token } );
            case 'None':
                req.flash('info', 'Link expired. Enter email to resend a new link.');
                return res.redirect('/forgot');
            case 'User':
                req.flash('error', 'Invalid link. No user.');
                return res.redirect('/login');
            case 'Verify':
                req.flash('info', 'User not verified. Check email for verify link.');
                return res.redirect('/login');
            default:
                req.flash('error', 'An error occured. Try again.');
                return res.redirect('/login');
        }

    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    };
};

const postReset = async (req, res, next) => {
    let password = req.body.password;
    let token_param = req.params.token;

    try {
        let status = await resetPOST(password, token_param);

        switch(status.status) {
            case 'Success':
                req.flash('info', 'Password successfully updated!');
                return res.redirect('/login');
            case 'Pass':
                req.flash('error', 'Password must contain 6 characters, uppercase, lowercase, & a digit.');
                return res.redirect('/reset/' + token_param);
            case 'None':
                req.flash('info', 'Link expired. Enter email to resend a new link.');
                return res.redirect('/forgot');
            case 'User':
                    req.flash('error', 'Invalid link. No user.');
                    return res.redirect('/login');
            case 'Verify':
                req.flash('info', 'User not verified. Check email for verify link.');
                return res.redirect('/login');
            default:
                req.flash('error', 'An error occured. Try again.');
                return res.redirect('/login');
        }
    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    };
}

module.exports = {
    postForgot,
    getReset,
    postReset
};