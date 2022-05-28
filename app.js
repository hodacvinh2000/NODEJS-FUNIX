const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/') {
        res.write('<html><body><form><input type="text" name="message" /><button type="submid">Send</button></form></body></html>');
        return res.end();
    }
    res.setHeader('Content-Type','text/html');
    res.write('<html><body></body><h1>Hello from my Node.js server!</h1></html>');
    res.end();
});

server.listen(3000);