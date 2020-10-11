const validate = require('../utils/auth/validate');
const { sendReset } = require('../utils/email/email');
const { findUser, findbyToken, createToken, deleteToken, findbyEmail, findToken } = require('../db/index');

const forgotPass = async (email) => {
    var user = email.toLowerCase();
    var emailValidation = validate.ValidateEmail(user);

    if(emailValidation == false){ return { status: 'Format' }; };

    let userDB = await findbyEmail(user);

    if (userDB.length < 1) { return { status: 'None' }; };

    userDB = userDB[0];

    if(userDB.verificationStatus != true){ return { status: 'Verify'}; };

    let tok = await findToken(userDB);

    console.log(tok);

    if(tok != null){ return {status: 'Token'}; };

    let token = await createToken({ id: userDB._id });

    await sendReset(userDB, token.token);

    return {status: 'Success'};
};

const resetGET = async (token) => {;
    let tokenDB = await findbyToken(token);

    if (tokenDB.length < 1) { return { status: 'None' }; };

    let userDB = await findUser(tokenDB[0]._userId);

    if (userDB == null) { return { status: 'User'} };

    if (!userDB.verificationStatus) { return { status: 'Verify'} };

    return { status: 'Success' }

};

const resetPOST = async (password, token_param) => {
    let passwordValidation = validate.ValidatePassword(password);

    if(passwordValidation == false) { return { status: 'Pass'}; };

    let tokenDB = await findbyToken(token_param);

    if (tokenDB.length < 1) { return { status: 'None' }; };

    let userDB = await findUser(tokenDB[0]._userId);

    if (userDB == null) { return { status: 'User'} };

    if (userDB.verificationStatus == false) { return { status: 'Verify'} };

    userDB.password = password;
    userDB.save();

    let tok = await deleteToken(token_param);

    return { status: 'Success'};
};

module.exports = {
    forgotPass,
    resetGET,
    resetPOST
};