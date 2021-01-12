exports.error_404 = (req,res, next)=>{
    res.status(404).render('404', { pageTitle: 'Page Not Found'
    , path : 'unknown',
    isAuthenticated:req.session.loggedIn
});
}