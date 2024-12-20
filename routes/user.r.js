const express = require('express');
const userController = require('../controllers/user.c');
const router = express.Router();

router.get('/cart_details', userController.cartDetails);

module.exports = router;