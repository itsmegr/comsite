const express = require('express');
const router = express.Router();

//using middlewares
//.use middleware
//for all the paths containing '/add-product' ex:- '/add-product', '/add-product/cone', '/add-product/xyz'

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');




// "/admin/add-product"
router.get('/add-product', isAuth, adminController.getAddProducts);
router.post('/add-product', isAuth, adminController.postAddProducts);

router.get('/edit-product/:id', isAuth, adminController.getEditProducts);
router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

router.get('/products', isAuth, adminController.getProducts);


module.exports = router;



