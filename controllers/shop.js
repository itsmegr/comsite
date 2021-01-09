const Product = require('../models/product'); 
const User = require('../models/user'); //here Product is class



exports.getIndex = (req, res, next) => {
  Product.getAllProducts()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Home',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    })
}


exports.getProducts = (req, res, next) => {
  Product.getAllProducts()
    .then((products) => {
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getProductDetail = (req, res, next) => {
  const productId = req.params.productId;
  Product.getById(productId)
    .then((queryProduct) => {
      res.render('shop/product-detail', {
        product: queryProduct,
        pageTitle: queryProduct.title,
        path: `/products/${queryProduct.id}`
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(e => { console.log(e); })
};




exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getById(prodId)
  .then(product=>{
    return req.user.addProductInCart(product);
  }).then(result=>{
    res.redirect('/cart');
  }).catch(e=>{
    console.log(e);
  })
};



exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user.deleteProductInCart(productId)
  .then(()=>{
    res.redirect('/cart');
  })
  .catch(e=>console.log(e));
}





exports.getCheckout = (req, res, nexr) => {
  res.render('shop/checkout.ejs', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
  .catch(err => console.log(err));
};


