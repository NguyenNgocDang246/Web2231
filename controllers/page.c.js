const userModel = require('../models/user.m');
const cartModel = require('../models/cart.m');
const { hashPassword } = require('../configs/crypto_config');
const passport = require('passport');

module.exports = ({
    login: async (req, res, next) => {
        passport.authenticate('myPassportStrategy',
            (err, user, info) => {
                if (err || !user) {
                    return res.redirect('/page/login?fail=true');
                }
                const guestCart = req.session.user?.cart || [];
                const returnTo = req.session.returnTo || '/product/all';
                delete req.session.returnTo;

                req.logIn(user, async (err) => {
                    if (err) {
                        return next(err);
                    }
                    if (req.body.remember === 'on') {
                        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
                    } else {
                        req.session.cookie.expires = false;
                    }
                    if (guestCart.length > 0) {
                        for (const guestItem of guestCart) {
                            await cartModel.addItem(guestItem, user._id); // Thêm item vào giỏ hàng của user
                        }
                    }
                    if(req.session.user)
                        req.session.user.type = 'LogedIn';
        
                    res.redirect(returnTo);
                });
            }
        )(req, res, next);
    },
    register: async (req, res) => {
        try {
            let { username, password, name, email, dob, phone } = req.body;
            const hasAcc = await userModel.findOne({ username: username });
            if (hasAcc) {
                res.status(400).json({ message: 'duplicate_user' });
                return;
            }
            const duplicateEmail = await userModel.findOne({ email: email });
            if (duplicateEmail) {
                res.status(400).json({ message: 'duplicate_email' });
                return;
            }

            password = hashPassword(password);

            const newUser = {
                name: name,
                dob: new Date(dob),
                email: email,
                username: username,
                password: password,
                role: "normal_user",
                phone: phone
            };

            userModel.add(newUser);
            res.redirect('/page/login');
        } catch (e) {
            next(e);
        }
    },
    logout: (req, res) => {
        if (req.session.user) {
            req.session.user = null;
        }
        req.logout((err) => {
            if (err) {
                return res.status(500).send("Có lỗi khi đăng xuất.");
            }
            req.session.destroy((destroyErr) => {
                if (destroyErr) {
                    return res.status(500).send("Có lỗi xảy ra khi xóa session. Vui lòng thử lại.");
                }
            });
            res.redirect('/page/login');
        });
    }
})