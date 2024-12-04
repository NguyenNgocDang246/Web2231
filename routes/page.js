const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    // res.render('Home', {isLoggin: req.session.isLoggedIn});
    res.render('Home', {
        user: {
            isLoggin: req.session.isLoggin,
        }
    });
});

router.get('/', (req, res) => {
    res.redirect('/home');
})


module.exports = router;