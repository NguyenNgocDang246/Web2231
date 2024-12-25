const express = require('express');
const productController = require('../controllers/product.c')
const router = express.Router();

router.get('/all', productController.getAll);
router.get('/id=:id', productController.getOne);
router.get('/topProducts', productController.getTopProduct);
router.post('/comment',require('../middlewares/checkAuth.mw') , productController.addComment);

router.get('/api', productController.api);


module.exports = router;