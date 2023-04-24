const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/history', isAuth, shopController.getOrders);


module.exports = router;
