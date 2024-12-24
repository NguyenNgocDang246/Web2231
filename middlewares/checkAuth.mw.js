const authMiddleware = (req, res, next) => {
    const openRoutes = ['/page/login', '/page/register', '/auth/google', '/auth/google/callback'];
    if (openRoutes.includes(req.path)) {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/page/login');
}
module.exports = authMiddleware;