const express = require('express');
const userController = require('../controllers/user.c');
const router = express.Router();

router.get('/cart_details', userController.cartDetails);
router.get('/order_details', userController.orderDetails);
router.get('/user_info', userController.userInfo);
router.post('/update_info', userController.userUpdate);

module.exports = router;