const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req);

    res.setHeader('Content-Type','text/html');
    res.write('<html><body></body><h1>Hello from my Node.js server!</h1></html>');
    res.end();
});

server.listen(3000);