const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


const error_404Handler =  require('./controllers/404');


//app.use middlem runs every time when a request comes
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(shopRoutes);
//paths that all contains /admin part
app.use('/admin' ,adminRoutes);



app.use(error_404Handler.error_404);


app.listen(8080)
