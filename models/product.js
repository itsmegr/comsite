// const db = require('../util/database');
// const Cart = require('./cart');





// module.exports = class Product {
//     constructor(id, title, imageUrl, price, desription)
//     {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.price = price;
//         this.description = desription;
//     }

//     save()//to save the new object in array or file 
//     {
//        return db.execute(`INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)`,
//         [this.title,this.price, this.imageUrl, this.description]
//         );
//     }

//     static fetchAll()
//     {
//         return db.execute('SELECT * FROM products');
//     }

//     static fetchTheProduct(productId)
//     {
//        return db.execute('SELECT * FROM products WHERE products.id = ?',[productId])
//     }

//     static deleteTheProduct(productId, cb)
//     {
        
//     }
// }


const  { Sequelize } = require('sequelize');

const sequelize = require('../util/database');


const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull:false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull:false
    },
    description:{
        type: Sequelize.STRING,
        allowNull:false,
    }
});


module.exports = Product;