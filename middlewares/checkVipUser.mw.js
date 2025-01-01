// Middleware kiểm tra nếu user chưa đăng nhập
const checkVipUser = (req, res, next) => {
    if (!req.isAuthenticated() || !(req.user.role === 'vip_user')) {
        const e = new Error('You need to be a VIP user to access this page.');
        e.status = 401;
        throw e;
    }
    next();
};

module.exports = checkVipUser;

