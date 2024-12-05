const express = require('express');
const pageController = require('../controllers/page.c')
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', {fail: req.params.fail});
})
router.post('/login', pageController.login);

router.get('/register', (req, res) => {
    res.render('register');
})
router.post('/register', pageController.register);

router.get('/logout', pageController.logout);

module.exports = router;