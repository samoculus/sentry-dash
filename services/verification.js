const validate = require('../utils/auth/validate');
const { sendVerification } = require('../utils/email/email');
const { findUser, findbyToken, createToken, deleteToken, findbyEmail, findToken } = require('../db/index');

const verifyAPIService = async (token) => {
    let tokenDB = await findbyToken(token);

    if (tokenDB.length < 1) { return { status: 'None' }; };

    let userDB = await findUser(tokenDB[0]._userId);

    if (userDB == null) { return { status: 'User'} };

    if (userDB.verificationStatus) { return { status: 'Verify'} };

    userDB.verificationStatus = true;
    userDB.save();

    let tok = await deleteToken(token);

    return { status: 'Success'};

};

const resendService = async (email) => {
    var emailValidation = validate.ValidateEmail(email.toLowerCase());

    if(!emailValidation) { return {status: 'Format'} };

    let userDB = await findbyEmail(email);

    if(userDB.length < 1) { return {status: 'None'} };

    let tokenDB = await findToken(userDB[0]._id);

    if(tokenDB != null) { return { status: 'Token' }; };

    if(userDB[0].verificationStatus != false) { return { status: 'Verify' } };

    const token = await createToken({id: userDB[0]._id});
    
    await sendVerification(userDB[0], token.token);

    return { status: 'Success' };
};

module.exports = {
    verifyAPIService,
    resendService
};