const { verifyAPIService, resendService } = require('../services/verification');

const verifyAPI = async (req, res, next) => {
    let token = req.params.token;

    try {
        let status = await verifyAPIService(token);

        switch(status.status) {
            case 'Success':
                req.flash('info', 'Email verified!');
                return res.redirect('/login');
            case 'None':
                req.flash('info', 'Link expired. <a href="/resend">Click here to resend a link.</a>');
                return res.redirect('/login');
            case 'User':
                req.flash('error', 'No user found matching this token.');
                return res.redirect('/login');
            case 'Verify':
                req.flash('info', 'This user is already verified.');
                return res.redirect('/login');
            default:
                req.flash('error', 'An error occured. Try again.');
                return res.redirect('/login');
        };

    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    }
};

const verifyResend = async (req, res, next) => {
    var email = req.body.email.toLowerCase();

    try {
        let status = await resendService(email);

        switch(status.status) {
            case 'Success':
                req.flash('info', 'Verification email sent.')
                return res.redirect('/resend');
            case 'Format':
                req.flash('error', 'Incorrect email format.');
                return res.redirect('/resend');
            case 'None':
                req.flash('error', 'No user with this email.');
                return res.redirect('/resend');
            case 'Token':
                req.flash('info', 'Token is valid. Check email for the link.')
                return res.redirect('/resend')
            case 'Verify':
                req.flash('info', 'Email is already verified.')
                return res.redirect('/resend');
            default:
                req.flash('error', 'An error occured. Try again.');
                return res.redirect('/resend');
        }

    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    };
};

module.exports = {
    verifyAPI,
    verifyResend
}