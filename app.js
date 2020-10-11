const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const params = require("./params/params");

const setUpPassport = require('./setuppassport');

const app = express();
app.use(compression());

mongoose.connect(params.DATABASECONNECTION, {useUnifiedTopology:true,
                      useNewUrlParser:true,
                      useCreateIndex:true});
setUpPassport();

app.set('port', process.env.Port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret:'GENERATE_SECURE_SKEY',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(helmet({
    contentSecurityPolicy:({ 
    directives:{
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'https://maxcdn.bootstrapcdn.com/'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'js.stripe.com'],
        frameSrc: ["'self'", 'js.stripe.com'],
        fontSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      }
    }),
}));

app.use('/', require('./routes/web'));
app.use('/api', require('./routes/api'));

app.use(express.static('public'));

app.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));

});