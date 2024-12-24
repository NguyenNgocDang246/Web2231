const express = require('express');
const cartController = require('../controllers/cart.c');
const router = express.Router();

router.post('/add', cartController.add); //
router.post('/remove', cartController.remove); //

module.exports = router;