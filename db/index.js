const User = require('../models/user');
const Token = require('../models/token');
const crypto = require('crypto');

const findUser = async (user) => {
    const userDB = await User.findById(user);

    return userDB;
};

const findbyEmail = async (email) => {
    const userDB = await User.find({email: email});

    return userDB;
};

const createUser = async (user) => {
    let newUser = await new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        stripeID: user.stripeID,
        subscriptionID: user.subscriptionID,
        paymentID: user.paymentID,
        last4: user.last4,
        brand: user.brand
    });

    newUser.save();

    return newUser;
};

const createToken = async (newUser) => {
    let token = await new Token({ _userId: newUser.id, token: crypto.randomBytes(16).toString('hex') });
    token.save();

    return token;
};

const findToken = async (user) => {
    let token = await Token.findOne({_userId: user._id});

    return token;
};

const findbyToken = async (token) => {
    let tok = await Token.find({token: token});

    return tok;
};

const deleteToken = async (token) => {
    let tok = Token.deleteOne({token: token});

    return tok;
};

module.exports = {
    findUser,
    findbyEmail,
    createUser,
    createToken,
    findToken,
    findbyToken,
    deleteToken
};