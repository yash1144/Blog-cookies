const User = require('../models/user');

// Show signup form
module.exports.showSignup = (req, res) => {
    res.render('signup', { error: null });
};

// Handle signup
module.exports.signup = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('signup', { error: 'Username already exists' });
        }
        const user = new User({ username, password });
        await user.save();
        res.cookie('userId', user._id, { httpOnly: true });
        req.username = user.username;
        return res.redirect('/blogs');
    } catch (err) {
        console.error(err);
        res.render('signup', { error: 'Error signing up' });
    }
};

// Show login form
module.exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle login
module.exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.render('login', { error: 'Invalid credentials' });
        }
        res.cookie('userId', user._id, { httpOnly: true });
        req.username = user.username;
        return res.redirect('/blogs');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Error logging in' });
    }
};

// Handle logout
module.exports.logout = (req, res, next) => {
    res.clearCookie('userId');
    res.redirect('/login');
};

// Export all controller functions as an object
