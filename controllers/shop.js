const Product = require('../models/product'); 
const User = require('../models/user'); //here Product is class
const Order = require('../models/order');


exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Home',
        path: '/',
        isAuthenticated:req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
    })
}


exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
        isAuthenticated:req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getProductDetail = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((queryProduct) => {
      res.render('shop/product-detail', {
        product: queryProduct,
        pageTitle: queryProduct.title,
        path: `/products/${queryProduct.id}`,
        isAuthenticated:req.session.loggedIn
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')//if we want to populate nested in every element in array
  .execPopulate()
    .then(user => {
      // console.log(user.cart.items)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
        isAuthenticated:req.session.loggedIn
      });
    })
    .catch(e => { console.log(e); })
};




exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
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
    pageTitle: 'Checkout',
    isAuthenticated:req.session.loggedIn
  })
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user  
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated:req.session.loggedIn
      });
    })
    .catch(err => console.log(err));
};


