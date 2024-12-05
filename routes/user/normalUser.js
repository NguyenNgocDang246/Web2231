const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('Login', {
        user: {
            isLoggin: false,
        }
    });
});

router.get('/register', (req, res) => {
    res.render('Register', {
        user: {
            isLoggin: false,
        }
    });
});

router.get('/card_details', (req, res) => {
    res.render('UserCardDetails', {
        user: {
            isLoggin: req.session.isLoggin,
        },
        
    });
});

router.get('/order_details', (req, res) => {
    const type = req.query.type;
    res.render('UserOrderDetails', {
        user: {
            isLoggin: req.session.isLoggin,
        },
        type: type,
    });
});

router.get('/user_info', (req, res) => {
    res.render('UserInfo', {
        user: {
            isLoggin: req.session.isLoggin,
        }
    });
});

module.exports = router;