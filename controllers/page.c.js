const userModel = require('../models/user.m');
const { hashPassword } = require('../configs/crypto_config');
const passport = require('passport');

module.exports = ({
    login: async (req, res, next) => {
        passport.authenticate('myPassportStrategy',
            (err, user, info) => {
                if (err || !user) {
                    res.redirect('/page/login?fail=true');
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    if (req.body.remember === 'on') {
                        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
                    } else {
                        req.session.cookie.expires = false;
                    }
                    res.redirect('/product/all');
                });
            }
        )(req, res, next);
    },
    register: async (req, res) => {
        try {
            let { username, password, name, email, dob } = req.body;
            const hasAcc = await userModel.findOne({ username: username });
            if (hasAcc) {
                res.json({ message: 'duplicate user' });
                return;
            }

            password = hashPassword(password);

            const newUser = {
                name: name,
                dob: dob,
                email: email,
                username: username,
                password: password,
                role: "normal_user"
            };

            userModel.add(newUser);
            res.redirect('/page/login');
        } catch (e) {
            next(e);
        }
    },
    logout: (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).send("Có lỗi khi đăng xuất.");
            }
        });
        res.redirect('/');
    }
})