const router = require('express').Router();
const passport = require('passport');
const cartModel = require('../models/cart.m');

router.get('/', passport.authenticate("google", { scope: ["profile", "email"] }));

// router.get('/callback', 
//     passport.authenticate("google", { failureRedirect: "/login?fail=true" }),
//     require('../middlewares/preserveSession.mw'),
//     async (req, res) => {
//         const user = req.user;
//         const guestCart = req.session.user?.cart || [];
//         console.log(req.session.user);
//         if (guestCart.length > 0) {
//             for (const guestItem of guestCart) {
//                 await cartModel.addItem(guestItem, user._id); // Thêm item vào giỏ hàng của user
//             }
//         }
//         if(req.session.user)
//             req.session.user.type = 'LogedIn';

//         const returnTo = req.session.returnTo || '/product/all';
//         delete req.session.returnTo;
//         res.redirect(returnTo);
//     }
// );

router.get('/callback',async (req, res, next) => {
    passport.authenticate('google',
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
});

module.exports = router;