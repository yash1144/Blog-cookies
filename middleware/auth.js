// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.cookies && req.cookies.userId) {
        return next();
    }
    res.redirect('/login');
}

// Redirect to login if not authenticated (for home page)
function requireAuth(req, res, next) {
    if (req.cookies && req.cookies.userId) {
        return next();
    }
    res.redirect('/login');
}

const User = require('../models/user');

// Make session info available to EJS
function setLocals(req, res, next) {
    res.locals.isAuthenticated = !!(req.cookies && req.cookies.userId);
    if (req.cookies && req.cookies.userId) {
        User.findById(req.cookies.userId)
            .then(user => {
                res.locals.username = user ? user.username : null;
                next();
            })
            .catch(() => {
                res.locals.username = null;
                next();
            });
    } else {
        res.locals.username = null;
        next();
    }
}

module.exports = {
    isAuthenticated,
    requireAuth,
    setLocals
}; 