const router = require('express').Router()

router.get('/', (req, res, next) => {

    res.render('home/index', {
        path: '/',
      });
});





module.exports = router;
