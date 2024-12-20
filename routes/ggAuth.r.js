const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/callback',
    passport.authenticate("google", { failureRedirect: "/login?fail=true" }),
    (req, res) => {
        res.redirect("/product/all");
    }
);


module.exports = router;