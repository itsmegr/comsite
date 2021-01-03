const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const db = require('./util/database');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM products')
// .then(result=>{
//     console.log(result[0][0]);
// })
// .catch(error=>{
//     console.log(error);
// });


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
