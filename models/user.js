const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const SALT_FACTOR = 10;

let userSchema = mongoose.Schema({
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    createdAt: {type:Date, default:Date.now},
    subscriptionStatus: {type:Boolean, required:true, default:false},
    verificationStatus: {type:Boolean, required:true, default:false},
    stripeID: {type:String, required:true, default:null},
    subscriptionID: {type:String, required:true, default:null},
    paymentID: {type:String, required:true, default:null},
    last4: {type:String, required:true, default:null},
    brand: {type:String, required:true, default:null},
});

userSchema.pre('save', function(done){
    let user = this;

    if(!user.isModified('password')){
        return done();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err){return done(err);}
        bcrypt.hash(user.password, salt, function(err, hashedPassword){
            if(err) {return done(err);}

            user.password = hashedPassword;

            done();
        });
    });

});

userSchema.methods.checkPassword = function(guess, done){
    if(this.password != null){
        bcrypt.compare(guess, this.password, function(err, isMatch){
            done(err, isMatch);
        });
    }
}

let User = mongoose.model('User', userSchema);

module.exports = User;