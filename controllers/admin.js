const Product = require('../models/product');  //here Product is class


exports.getProducts = (req,res,next)=>{
    req.user.getProducts()
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
    })
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
    req.user
    .createProduct({
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
    })
    .then(result=>{
        res.redirect('/admin/products');
    })
    .catch(e=>{
        console.log(e);
    })
}


exports.getEditProducts = (req,res,next)=>{
    const editMode = req.query.edit;
    if(editMode=="false"){
        res.redirect('/');
    }
    req.user.getProducts({where:{id:req.params.id}})
    .then(products=>{
        product = products[0];
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
    Product.findByPk(req.body.id)
    .then(product=>{
        product.title = req.body.title;
        product.price = req.body.price;
        product.imageUrl = req.body.imageUrl;
        product.description = req.body.description;
        return product.save();
    })
    .then((result)=>{
        res.redirect('/admin/products');
    }).catch(e=>{
        console.log(e);
    })
}


exports.postDeleteProduct = (req,res,next)=>{
    Product.findByPk(req.body.id)
    .then(product=>{
        return product.destroy();
    })
    .then((result)=>{
        res.redirect('/admin/products');
    }).catch(e=>{
        console.log(e);
    })
}


