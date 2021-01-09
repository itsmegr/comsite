const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.set('view engine', 'ejs');
app.set('views', 'views');


const User = require('./models/user');
const error_404Handler =  require('./controllers/404');
const mongoConnection = require('./util/database').mongoConnection;



//app.use middlem runs every time when a request comes
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));



//adding user to every request
app.use((req,res,next)=>{
    User.getById("5ff82b23797a45987db3f0ee")
    .then(user=>{
        //we are not only registering data field, we are also sending all the methods 
        //that we can use in sequelize
        req.user = new User(user.name,user.email,user.cart,user._id);
        next();
    })
    .catch(e=>{
        console.log(e);
    })
})

app.use(shopRoutes)
app.use('/admin' ,adminRoutes);
app.use(error_404Handler.error_404);


mongoConnection(()=>{
    app.listen(3000,()=>{
        console.log('Server Started');
    })
})

