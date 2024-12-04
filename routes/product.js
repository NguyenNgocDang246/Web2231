const express = require('express');
const router = express.Router();

router.get('/id=:id', (req, res) => {
    res.render('ProductDetails', {
        user: {
            isLoggin: req.session.isLoggin,
        }
    });
});


module.exports = router;