// middle ware for checking if logged in
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

// middle ware for checking if not logged in
function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    return next()
}

module.exports = {
    checkAuth,
    checkNotAuth
}