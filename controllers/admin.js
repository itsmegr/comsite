const Product = require('../models/product');  //here Product is class

exports.getAddProducts = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../', 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
      });
}


exports.postAddProducts = (req,res,next)=>{
    const newProduct = new Product(null,req.body.title, req.body.imageUrl, req.body.price, req.body.description);
    newProduct.save();
    res.redirect('/admin/products');
}


exports.getEditProducts = (req,res,next)=>{

    const editMode = req.query.edit;
    if(editMode=="false"){
        res.redirect('/');
    }

    Product.fetchTheProduct(req.params.id, (product)=>{
        if(!product) res.redirect('/')
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing : editMode,
            product:product
          });
    })
}

exports.postEditProduct = (req,res,next)=>{
    const editedProd = new Product(req.body.id, req.body.title, req.body.imageUrl, req.body.price, req.body.description);
    editedProd.save();
    res.redirect('/admin/products');
}


exports.postDeleteProduct = (req,res,next)=>{
    Product.deleteTheProduct(req.body.id,()=>{
        res.redirect('/admin/products');
    })
}

exports.getProducts = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
          hasProducts: products.length > 0,
          activeShop: true,
          productCSS: true
        });
    });
}
