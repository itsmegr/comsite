//creating server

const http = require('http');
const routes = require('./sec2Routes');

console.log(routes.someText);
const server =  http.createServer(routes.handler);

server.listen(8080);