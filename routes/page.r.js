const express = require('express');
const pageController = require('../controllers/page.c')
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('Login', {fail: req.query.fail});
})
router.post('/login', pageController.login);

router.get('/register', (req, res) => {
    res.render('Register');
})
router.post('/register', pageController.register);

router.get('/logout', pageController.logout);

module.exports = router;