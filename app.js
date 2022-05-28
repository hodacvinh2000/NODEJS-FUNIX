const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html><body><form action="/message" method="POST"><input type="text" name="message" /><button type="submid">Send</button></form></body></html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        fs.writeFileSync('message.txt','DUMMY');
        res.statusCode = 302;
        res.setHeader('Location','/');
    }
    res.setHeader('Content-Type','text/html');
    res.write('<html><body></body><h1>Hello from my Node.js server!</h1></html>');
    res.end();
});

server.listen(3000);