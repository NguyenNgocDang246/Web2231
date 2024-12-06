const express = require('express');
const checkoutController = require('../controllers/checkout.c');
const router = express.Router();

router.post('/request', checkoutController.request);

router.get('/confirm', checkoutController.renderConfirm);
router.get('/getToken', checkoutController.getToken);
router.post('/confirm', checkoutController.confirm);

module.exports = router;