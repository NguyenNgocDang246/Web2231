const express = require('express');
const userController = require('../controllers/user.c');
const router = express.Router();

router.get('/cart_details', userController.cartDetails);
router.get('/order_details', require('../middlewares/checkAuth.mw'), userController.orderDetails);
router.get('/user_info', require('../middlewares/checkAuth.mw'), userController.userInfo);
router.post('/update_info', require('../middlewares/checkAuth.mw'), userController.userUpdate);
router.post('/change_password', require('../middlewares/checkAuth.mw'), userController.changePassword);

module.exports = router;