const Product = require('../models/product');  //here Product is class



exports.getIndex = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
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

  Product.findByPk(productId)
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
    .then(cart => {
      return cart.getProducts();
    })
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
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};



exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:productId}});
  })
  .then(products=>{
    const product = products[0];
    return product.cartItem.destroy();
  })
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
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};


