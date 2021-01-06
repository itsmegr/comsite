const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();



const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');




const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');

const error_404Handler =  require('./controllers/404');

//app.use middlem runs every time when a request comes
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//adding user to every request
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        //we are not only registering data field, we are also sending all the methods 
        //that we can use in sequelize
        req.user = user;
        next();
    })
    .catch(e=>{
        console.log(e);
    })
})

app.use(shopRoutes);
app.use('/admin' ,adminRoutes);
app.use(error_404Handler.error_404);


//making the connections betwee the tables//way of defining is one-to-one or many-to-one and so more
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});


//syncking the models here with database
sequelize
.sync()
// .sync({force:true})
.then(result =>{
    return User.findByPk(1)
})
.then(user=>{
    
    if(!user){
        return User.create({ name:'Govind', email:'govind@test.com'});
    }
    return user;
})
.then(user=>{
    
     Cart.findAll({where:{userId:1}}).then(cart=>{
        // console.log(cart);
        if(cart.length<=0){
            return user.createCart();
        }
        return cart;
    });
    // console.log(user);
    
})
.then(cart=>{
    app.listen(8080);
})
.catch(err=>{
    console.log(err);
})


