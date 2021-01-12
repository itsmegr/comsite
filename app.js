const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');




app.set('view engine', 'ejs');
app.set('views', 'views');


const User = require('./models/user');
const error_404Handler = require('./controllers/404');
const MONGODB_URI = 'mongodb+srv://Govind:Govind@2000@cluster0.zjpw7.mongodb.net/ShoppingApp?retryWrites=true&w=majority';


//reaching to the store in database for sessions 
const store = new mongoDbStore({
    uri:MONGODB_URI,
    collection:'sessions'
})



//app.use middlem runs every time when a request come
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({ secret: 'my secret',
     resave: false, 
     saveUninitialized: false,
     store:store
    })
);



//adding user to every reque
app.use((req, res, next) => {
    if(!req.session.user){
        next();
        return;
    }
    User.findById(req.session.user._id)
        .then(user => {
            //we are not only registering data field, we are also sending all the methods 
            //that we can use in sequelize
            req.user = user;
            next();
        })
        .catch(e => {
            console.log(e);
            res.send('no user');
        })
})



app.use(authRoutes);
app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(error_404Handler.error_404);



mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(8080,()=>{
            console.log('server started');
        })
    }).catch(e => {
        console.log(e);
    })

