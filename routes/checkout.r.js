const express = require('express');
const checkoutController = require('../controllers/checkout.c');
const router = express.Router();

router.post('/request', require('../middlewares/checkAuth.mw') ,checkoutController.request);

router.get('/confirm', require('../middlewares/checkAuth.mw'), checkoutController.renderConfirm);
router.get('/getToken', require('../middlewares/checkAuth.mw'), checkoutController.getToken);
router.post('/confirm', require('../middlewares/checkAuth.mw'), checkoutController.confirm);

module.exports = router;