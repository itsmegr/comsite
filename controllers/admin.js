const Product = require('../models/product');  //here Product is class


exports.getProducts = (req,res,next)=>{
    Product.getAllProducts()
    .then(products=>{
        res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0
        });
    })
    .catch(e=>{
        console.log(e);
    });
}

exports.getAddProducts = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../', 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
      });
}


exports.postAddProducts = (req,res,next)=>{
    const newPro = new Product(req.body.title,req.body.imageUrl,req.body.price,req.body.description, req.user._id,null);
    newPro.Save().then((result)=>{
        res.redirect('/admin/products');
    }).catch(e=>{console.log(e)});
}


exports.getEditProducts = (req,res,next)=>{
    const editMode = req.query.edit;
    if(editMode=="false"){
        res.redirect('/');
    }
    Product.getById(req.params.id)
    .then(product=>{
        if(!product) res.redirect('/');
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing : editMode,
            product:product
          });
    })
    .catch(e=>{
        console.log(e);
    })
}

exports.postEditProduct = (req,res,next)=>{
    Product.updateProduct(req.body.id,req.body.title,req.body.imageUrl,req.body.price,req.body.description)
    .then((result)=>{
        res.redirect('/admin/products');
    }).catch(e=>{
        console.log(e);
    })
}


exports.postDeleteProduct = (req,res,next)=>{
    Product.deleteProduct(req.body.id)
    .then((result)=>{
        res.redirect('/admin/products');
    }).catch(e=>{
        console.log(e);
    })
}


