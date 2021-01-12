const Product = require('../models/product');
const User = require('../models/user');  //here Product is class

//something we can use here, every product has the userId and with mongoose
//we can get the complete document of user or seleced fields
exports.getProducts = (req,res,next)=>{
    Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name email')
        .then(products=>{
        // console.log(products);
        res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0,
        isAuthenticated:req.session.loggedIn
        });
    })
    .catch(e=>{
        console.log(e);itsmegr/cpp_codes
    });
}

exports.getAddProducts = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../', 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated:req.session.loggedIn
      });
}


exports.postAddProducts = (req,res,next)=>{
    const newPro = new Product({
        title:req.body.title,
        imageUrl:req.body.imageUrl,
        price:req.body.price,
        description:req.body.description,
        userId:req.user
    });
    newPro.save().then((result)=>{
        res.redirect('/admin/products');
    }).catch(e=>{console.log(e)});
}


exports.getEditProducts = (req,res,next)=>{
    const editMode = req.query.edit;
    if(editMode=="false"){
        res.redirect('/');
    }
    Product.findById(req.params.id)
    .then(product=>{
        if(!product) res.redirect('/');
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing : editMode,
            product:product,
            isAuthenticated:req.session.loggedIn
          });
    })
    .catch(e=>{
        console.log(e);
    })
}

exports.postEditProduct = (req,res,next)=>{
    Product.findByIdAndUpdate(req.body.id,{
        title:req.body.title,
        imageUrl:req.body.imageUrl,
        price:req.body.price,
        description:req.body.description
    })
    .then((result)=>{
        res.redirect('/admin/products');
    }).catch(e=>{
        console.log(e);
    })
}


exports.postDeleteProduct = (req,res,next)=>{
    const prodId=req.body.id;
    Product.findOneAndDelete(prodId)
    .then((result)=>{
        const newCartItems = req.user.cart.items.filter(p=>{
            return p.productId.toString()!=prodId.toString();
        })
        req.user.cart.items = newCartItems;
        return req.user.save();
    }).then(()=>{
        res.redirect('/admin/products');
    }).catch(e=>{
        console.log(e);
    })
}


