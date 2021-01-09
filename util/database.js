const mongodb = require('mongodb');
let _db ;

const MongoClient = mongodb.MongoClient;

const mongoConnection = (cb)=>{
  MongoClient.connect(
    'mongodb+srv://Govind:Govind@2000@cluster0.zjpw7.mongodb.net/ShoppingApp?retryWrites=true&w=majority'
  ,{ useUnifiedTopology: true })
  .then(client=>{
    _db = client.db('ShoppingApp');
    console.log('db connected');
    // console.log(_db);
    cb();
  })
  .catch(e=>{
    console.log(e);
  });
};


const getDb = ()=>{
  if(_db){
    return _db;
  }
  throw "No Database Available";
}


exports.mongoConnection = mongoConnection;
exports.getDb = getDb;