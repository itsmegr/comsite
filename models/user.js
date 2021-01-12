const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cart:{
        items:[
            {
                productId:{type:Schema.Types.ObjectId,ref:'Product', required:true},
                quantity:{type:Number, required:true}
            }
        ]
    }
});
userSchema.methods.addProductInCart  = function(product){
    if (this.cart == undefined) this.cart = { items: [] };
    const prodIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() == product._id.toString();
    })
    if (prodIndex === -1) {
      this.cart.items.push({ productId: product._id, quantity: 1 });
    }
    else {
      this.cart.items[prodIndex].quantity += 1;
    }
    return this.save();
}

userSchema.methods.deleteProductInCart = function(productId){
    const updatedItems = this.cart.items.filter(p=>{
        return p.productId.toString()!=productId.toString();
    })
    this.cart.items = updatedItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };
  

module.exports = mongoose.model('User', userSchema);















// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;


// module.exports = class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;//{items:[], price:}
//     this._id = id;
//   }
//   Save() {
//     const db = getDb()
//     return db.collection('users').insertOne(this);
//   }


//   addProductInCart(product) {
//     const db = getDb();

//     if (this.cart == undefined) this.cart = { items: [] };
//     const prodIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() == product._id.toString();
//     })
//     if (prodIndex === -1) {
//       this.cart.items.push({ productId: product._id, quantity: 1 });
//     }
//     else {
//       this.cart.items[prodIndex].quantity += 1;

//     }
//     return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, {
//       $set: {
//         cart: this.cart
//       }
//     })
//   }


//   getCart() {
//     const db = getDb();
//     if (this.cart == undefined) this.cart = { items: [] };
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()  
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       })
//   }

//   deleteProductInCart(productId){
//     const db = getDb();
//     const prodIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() == productId.toString();
//     })
//     if (prodIndex > -1) {
//       this.cart.items.splice(prodIndex, 1);
//     }
//     return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, {
//       $set: {
//         cart: this.cart
//       }
//     })
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name
//           }
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }


//   getOrders(){
//     const db = getDb();
//     return db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)}).toArray()
//   }



//   static getById(id) {
//     const db = getDb();
//     return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
//   }
// }