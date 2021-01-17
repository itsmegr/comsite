module.exports = (req, res, next) => {
    if (!req.session.loggedIn) {
        // console.log('unauthorized request');
        return res.redirect('/login');
    }
    next();
}