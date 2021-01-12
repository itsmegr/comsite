const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports = mongoose.model('Product', productSchema);





// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
// // const Cart = require('./cart');

// module.exports = class Product {
//     constructor(title, imageUrl, price, desription, userId,id) {
//         // this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.price = parseFloat(price);
//         this.description = desription;
//         this.userId = userId;
//         this._id = id;

//     }
//     Save() {
//         const db = getDb()
//         return db.collection('products').insertOne(this);
//     }

//     static getAllProducts() {
//         const db = getDb()

//         return db.collection('products').find().toArray()
//     }

//     static getById(prodId) {
//         const db = getDb();
//         return db.collection('products')
//             .find({ _id: new mongodb.ObjectId(prodId) }).next()
//     }

//     static updateProduct(id, title, imageUrl, price, desription) {
//         const db = getDb()
//         return db.collection('products').updateOne({ _id: new mongodb.ObjectId(id)},{ $set : {
//             title : title,
//             imageUrl : imageUrl,
//             price : price,
//             description : desription
//         }})
//     }

//     static deleteProduct(id){
//         const db = getDb();
//         //deleting the items from cart also in database
//         return  db.collection('users').find().forEach((user)=>{
//             // console.log(user);
//             const updateditems = user.cart.items.filter(item =>{
//                 // console.log(item.productId.toString(),id.toString())
//                return item.productId.toString()!=id.toString();
//             });
//             // console.log(updateditems);
//             return db.collection('users').updateOne({ _id: new mongodb.ObjectId(user._id) }, {
//                 $set: {
//                   'cart.items': updateditems
//                 }
//               })
//         }).then(()=>{
//             return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) })
//         })       
//     }
// }


// // const  { Sequelize } = require('sequelize');

// // const sequelize = require('../util/database');


// // const Product = sequelize.define('product', {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey:true
// //     },
// //     title: Sequelize.STRING,
// //     price: {
// //         type: Sequelize.DOUBLE,
// //         allowNull:false
// //     },
// //     imageUrl: {
// //         type: Sequelize.STRING,
// //         allowNull:false
// //     },
// //     description:{
// //         type: Sequelize.STRING,
// //         allowNull:false,
// //     }
// // });


// // module.exports = Product;