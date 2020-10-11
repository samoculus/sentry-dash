// Middleware to check if user is logged in.

var ensureLogged = function ensureAuthentication(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash('info', 'Login to access this page');
        res.redirect('/login');
    }
}

module.exports = {ensureLoggedIn: ensureLogged}