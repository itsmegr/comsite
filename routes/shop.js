const express = require('express');
const router = express.Router();



const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');



router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

//keep it always above dynamic route

router.get('/products/:productId', shopController.getProductDetail);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/invoice/:orderId', isAuth, shopController.getInvoice);



module.exports = router;