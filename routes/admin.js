const path = require('path');

const express = require('express');
const router = express.Router();


//using middlewares
//.use middleware
//for all the paths containing '/add-product' ex:- '/add-product', '/add-product/cone', '/add-product/xyz'

const adminController = require('../controllers/admin');



// "/admin/add-product"
router.get('/add-product',adminController.getAddProducts);
router.post('/add-product',adminController.postAddProducts);

router.get('/edit-product/:id',adminController.getEditProducts);
router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

router.get('/products', adminController.getProducts);




module.exports = router;



