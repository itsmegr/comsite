const fs = require('fs');

const requestHandler = (req,res)=>{
    const url = req.url;
    const method = req.method;


    if(url==='/')
    {
        res.write('<html><form action="/message" method="POST"><input type="text" name="msg"><button type="submit">Send</button></form></html>')
        return res.end();
    }
    if(url=='/message' && method === 'POST')
    {
        //parsing the request body
        //takes data in stream
        const body =[];



        //these req.on are unsynchrounous function ....it register these functions and to not execute
        //them synchrounousely
        //watch video 35 to understand it completely


        //chunk is unreadable data

        req.on('data', (chunk)=>{
            console.log(chunk)
            body.push(chunk);
        });
        return req.on('end', ()=>{
            console.log(body);
            const parsedBody = Buffer.concat(body).toString();
            const mess = parsedBody.split('=')[1];
            // fs.writeFileSync('msg.txt',mess);        :this is synchroounoous and block the execution of 
            //of code but we dont want to do so we will use 
            //video 36

            fs.writeFile('msg.txt',mess,(err) =>{
                res.statusCode = 302;
                res.setHeader('Location','/');
                res.end();
            })

        });

        //wherever you see callback function in any function(methods), these methods
        // are the unsynchrounoumous code  

    }
    res.setHeader('Content-Type','text/html');
    res.write('<h1>Hii hello From Govind</h1>');
    res.end();
}
//exporting functions and anything to main app.js
//module.exports is a variable whose value can be anything object, function etc.00
// module.exports = requestHandler;

// module.exports = {
//     handler : requestHandler,
//     someText : "some random text"
// }
exports.handler = requestHandler;
exports.someText = "some Random text";