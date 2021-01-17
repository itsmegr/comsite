const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const User = require('../models/user'); //here Product is class
const Order = require('../models/order');
const ITEMS_PER_PAGE = 2;


exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find().countDocuments().then(total=>{
    totalItems = total;
    return Product.find()
    .skip((page-1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
  .then(products=>{
    // console.log(products)
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Home',
        path: '/',
        currentPage : page,
        hasNext: (ITEMS_PER_PAGE * page ) < totalItems,
        hasPrevious : page>1,
        lastPage : Math.ceil(totalItems/ITEMS_PER_PAGE)
      });
  }).catch(e=>{
    console.log(e);
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(e);
  })
  // Product.find().countDocuments().then((total=>{
  //   totalItems = total;
  //   return Product.find()
  //   .skip((page-1) * ITEMS_PER_PAGE)
  //   .limit(ITEMS_PER_PAGE)
  // })
  // .then((products) => {
  //   console.log(products)
  //     res.render('shop/index', {
  //       prods: products,
  //       pageTitle: 'Home',
  //       path: '/',
  //       currentPage : page,
  //       hasNext: (ITEMS_PER_PAGE * page ) < totalItems,
  //       hasPrevious : page>1,
  //       lastPage : Math.ceil(totalItems/ITEMS_PER_PAGE)
  //     });
  //   })
  //   .catch(e => {
  //     console.log(e);
  //     const error = new Error(e);
  //     error.httpStatusCode = 500;
  //     return next(e);
  //   })
  // );
}


exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find().countDocuments().then(total=>{
    totalItems = total;
    return Product.find()
    .skip((page-1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
  .then(products=>{
    // console.log(products)
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
        currentPage : page,
        hasNext: (ITEMS_PER_PAGE * page ) < totalItems,
        hasPrevious : page>1,
        lastPage : Math.ceil(totalItems/ITEMS_PER_PAGE)
      });
  }).catch(e=>{
    console.log(e);
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(e);
  })
  // Product.find()
  //   .then((products) => {
  //     res.render('shop/products-list', {
  //       prods: products,
  //       pageTitle: 'All products',
  //       path: '/products'
  //     });
  //   })
  //   .catch(e => {
  //     console.log(e);
  //     const error = new Error(e);
  //     error.httpStatusCode = 500;
  //     return next(e);
  //   });
}

exports.getProductDetail = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((queryProduct) => {
      res.render('shop/product-detail', {
        product: queryProduct,
        pageTitle: queryProduct.title,
        path: `/products/${queryProduct.id}`
      })
    })
    .catch(e => {
      console.log(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(e);
    });
}

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')//if we want to populate nested in every element in array
    .execPopulate()
    .then(user => {
      // console.log(user.cart.items)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items
      });
    })
    .catch(e => {
      console.log(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(e);
    });
};




exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addProductInCart(product);
    }).then(result => {
      res.redirect('/cart');
    })
    .catch(e => {
      console.log(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(e);
    });
};



exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user.deleteProductInCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(e => {
      console.log(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(e);
    });
}





exports.getCheckout = (req, res, nexr) => {
  res.render('shop/checkout.ejs', {
    path: '/checkout',
    pageTitle: 'Checkout'
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
    .catch(e => {
      console.log(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(e);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(e => {
      console.log(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(e);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();


      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   'inline; filename="' + invoiceName + '"'
      // );
      // file.pipe(res);


    })
    .catch(err => next(err));
};