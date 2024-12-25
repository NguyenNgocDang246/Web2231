const router = require('express').Router();
router.get('/isGuest', (req, res) => {
    return req.session.user?.type === 'guest' ? res.json({isGuest: true}) : res.json({isGuest: false});
})
module.exports = router;