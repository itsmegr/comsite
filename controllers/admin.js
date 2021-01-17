const Product = require('../models/product');
const User = require('../models/user');  //here Product is class
const fileHelper = require('../util/file');
const ITEMS_PER_PAGE = 2;

//something we can use here, every product has the userId and with mongoose
//we can get the complete document of user or seleced fields
exports.getProducts = (req, res, next) => {

    const page = +req.query.page || 1;
    let totalItems;

    Product.find({ userId: req.user._id }).countDocuments().then(total => {
        totalItems = total;
        return Product.find({ userId: req.user._id })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
    })
        .then(products => {
            // console.log(products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: products.length > 0,
                currentPage: page,
                hasNext: (ITEMS_PER_PAGE * page) < totalItems,
                hasPrevious: page > 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        }).catch(e => {
            console.log(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(e);
        })


    // Product.find({ userId: req.user._id })
        // // .select('title price -_id'){userId:req.user._id}
        // // .populate('userId', 'name email')
        // .then(products => {
        //     // console.log(products);
        //     res.render('admin/products', {
        //         prods: products,
        //         pageTitle: 'Admin Products',
        //         path: '/admin/products',
        //         hasProducts: products.length > 0
        //     });
        // })
        // .catch(e => {
        //     console.log(e);
        //     const error = new Error(e);
        //     error.httpStatusCode = 500;
        //     return next(error);
        // });
}

exports.getAddProducts = (req, res, next) => {
    // res.sendFile(path.join(__dirname,'../', 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        message: null,
        isError: false
    });
}


exports.postAddProducts = (req, res, next) => {
    if (!req.file) {
        res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            product: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
            },
            message: 'This file type is not allowed',
            isError: true
        });
    }


    const newPro = new Product({
        title: req.body.title,
        imageUrl: req.file.path,
        price: req.body.price,
        description: req.body.description,
        userId: req.user
    });
    newPro.save().then((result) => {
        res.redirect('/admin/products');
    })
        .catch(e => {
            console.log('coming form here', e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });
}


exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit;
    if (editMode == "false") {
        res.redirect('/');
    }
    Product.findById(req.params.id)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            if (!product) res.redirect('/');
            res.render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                message: null,
                isError: false
            });
        })
        .catch(e => {
            console.log(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(e);
        });
}

exports.postEditProduct = (req, res, next) => {

    Product.findOne({ _id: req.body.id }).then(product => {
        product.title = req.body.title,
            product.price = req.body.price,
            product.description = req.body.description
        if (req.file) {
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = req.file.path;
        }
        return product.save()
    })
        .then((result) => {
            res.redirect('/admin/products');
        })
        .catch(e => {
            console.log(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
        });
}


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.id;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found.'));
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(() => {
            const newCartItems = req.user.cart.items.filter(p => {
                return p.productId.toString() != prodId.toString();
            })
            req.user.cart.items = newCartItems;
            return req.user.save();
        })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}