const { createCustomer } = require("../services/register");

const postCustomer = async (req, res, next) => {
    const userObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        paymentMethodID: req.body.paymentMethodId,
        last4: req.body.last4,
        brand: req.body.brand
    };

    try {
        let subscription = await createCustomer(userObj);
        
        return res.json( subscription );

    } catch(err) {
        console.log(err.message);
        return res.sendStatus(500) && next(err);
    }
};

module.exports = {
    postCustomer
};