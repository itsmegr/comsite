const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'shopping-app',
    password:'Govind@2000'
})
////////////
module.exports = pool.promise();