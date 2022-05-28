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
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
            console.log(chunk);
        });
        req.on('end', () => {
            const parseBody  = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            fs.writeFileSync('message.txt',message);
            console.log(parseBody);
            res.statusCode = 302;
            res.setHeader('Location','/');
            return res.end();
        });
    }
    res.setHeader('Content-Type','text/html');
    res.write('<html><body></body><h1>Hello from my Node.js server!</h1></html>');
    res.end();
});

server.listen(3000);