const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

//to get the path of current app.js app file here, use it wherever always result will be
//to learn_nodejs directory 
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');



const readTheFile = function (cb){
    //this function is running async so wait for it before sending the responce
    fs.readFile(p, (err, fileContent) => {
        if(err) cb([]);
        else cb(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, desription)
    {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = desription;
    }

    save()//to save the new object in array or file 
    {
        if(this.id)
        {
            readTheFile(products=>{
                let prodToBeEditIndex = products.findIndex(prod => prod.id==this.id);
                products[prodToBeEditIndex] = this;
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                    
                }) 
            })  
        }
        else
        {
            this.id = Math.random().toString();
            readTheFile((products)=>{
                products.push(this);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                    
                })
            })
        }

    }

    static fetchAll(cb)
    {
        readTheFile(cb);
    }

    static fetchTheProduct(productId, cb)
    {
        readTheFile((products)=>{
            const queryProduct = products.find((p)=> p.id===productId);
            cb(queryProduct);
        })
    }

    static deleteTheProduct(productId, cb)
    {
        readTheFile((products)=>{
            const queryProductIndex = products.findIndex((p)=> p.id===productId);
            const queryProduct = products[queryProductIndex];
            if (queryProductIndex > -1) {
                products.splice(queryProductIndex, 1);
              }
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                Cart.deleteProduct(queryProduct.id, queryProduct.price,()=>{
                    cb();
                });
            });
        })
    }
}