exports.error_404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found'
        , path: 'unknown',
        isAuthenticated: req.session.loggedIn
    });
}

exports.error_500 = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Something went wrong'
        , path: '/500',
        isAuthenticated: req.session.loggedIn
    });
}