const { query } = require('express');
const Product = require('../models/product');  //here Product is class
const Cart = require('../models/cart');


exports.getProducts =  (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../', 'views', 'shop.html'));

    Product.fetchAll((products)=>{
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    });
    //here products is a array of aall the products
}

exports.getProductDetail = (req,res,next)=>{
  const productId = req.params.productId;
  // console.log(productId);
  // res.redirect('/');
  Product.fetchTheProduct(productId, (queryProduct)=>{
    res.render('shop/product-detail',{
      product: queryProduct,
      pageTitle: queryProduct.title,
      path: `/products/${queryProduct.id}`
    })
  })
}

exports.getIndex = (req,res,next)=>{
  Product.fetchAll((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Home',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
}



exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};




exports.postCart = (req,res,next)=>{
  const productId = req.body.productId;
  Product.fetchTheProduct(productId, (pro)=>{
    Cart.addProduct(productId,pro.price);
    res.redirect('/cart');
  })
}



exports.postCartDeleteItem = (req,res,next)=>{
  const productId = req.body.productId;
  Product.fetchTheProduct(productId, prod=>{
     Cart.deleteProduct(productId, prod.price, ()=>{
       res.redirect('/cart');
     })
  })
}





exports.getCheckout = (req,res,nexr)=>{
  res.render('shop/checkout.ejs', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}

exports.getOrders = (req,res,nexr)=>{
  res.render('shop/orders.ejs', {
    path: '/orders',
    pageTitle: 'Orders'
  })
}


