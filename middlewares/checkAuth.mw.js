const authMiddleware = (req, res, next) => {
    const openRoutes = ['/page/login', '/page/register', '/auth/google', '/auth/google/callback'];
    if (openRoutes.includes(req.path)) {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }
    if(req.method === 'GET' && !(req.originalUrl.includes('/checkout'))) {
        req.session.returnTo = req.originalUrl;
    }
    
    return res.redirect('/page/login');
}
module.exports = authMiddleware;