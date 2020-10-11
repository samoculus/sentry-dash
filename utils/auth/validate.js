function ValidatePassword(password) { 
    if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) { 
        return true;
    } else { 
        return false;
    }
};

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)){
        return (true)
    } else {     
        return (false)
    }
};

module.exports.ValidatePassword = ValidatePassword;
module.exports.ValidateEmail = ValidateEmail;