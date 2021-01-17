const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');




app.set('view engine', 'ejs');
app.set('views', 'views');


const User = require('./models/user');
const errorController = require('./controllers/error');
const { diskStorage } = require('multer');
const MONGODB_URI = 'mongodb+srv://Govind:Govind@2000@cluster0.zjpw7.mongodb.net/ShoppingApp?retryWrites=true&w=majority';


//reaching to the store in database for sessions 
const store = new mongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null,true);
    }
    else{
        cb(null, false);
    }
}

//app.use middlem runs every time when a request come
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter:fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.loggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})


//when you throw error sync then event without calling the error handling middleare it will get called
//but if you throw an error unsync then you have to call the midddleware splicitly
//adding user to every reque
app.use((req, res, next) => {
    if (!req.session.user) {
        next();
        return;
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            //we are not only registering data field, we are also sending all the methods 
            //that we can use in sequelize
            req.user = user;
            next();
        })
        .catch(e => {
            console.log(e);
            next(new Error(e));
        })
})

app.use(authRoutes);
app.use(shopRoutes);
app.use('/admin', adminRoutes);

app.get('/500', errorController.error_500)

app.use(errorController.error_404);


// app.use((error, req, res, next) => {
//     res.status(500).render('500', {
//         pageTitle: 'Something went wrong',
//         path: '/500',
//         isAuthenticated: req.session.loggedIn
//     });
// });

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(8080, () => {
            console.log('server started');
        })
    }).catch(e => {
        console.log(e);
    })

