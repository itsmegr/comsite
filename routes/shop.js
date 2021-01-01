const path = require('path');
const express = require('express');
const router = express.Router();



const shopController = require('../controllers/shop');




router.get('/',shopController.getIndex);

router.get('/products', shopController.getProducts);

//keep it always above dynamic route
router.get('/products/delete');

router.get('/products/:productId', shopController.getProductDetail);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteItem);

router.get('/orders', shopController.getOrders)

router.get('/checkout', shopController.getCheckout);



module.exports = router;