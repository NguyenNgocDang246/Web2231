// Middleware kiểm tra nếu user chưa đăng nhập
const checkGuest = (req, res, next) => {
    if (!req.isAuthenticated() && !req.session.user) {
        req.session.user = {
            type: 'guest',  
            cart: [],       
        };
    }
    next();
};

module.exports = checkGuest;

