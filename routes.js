const exp = require('constants');
const fs = require('fs');

const requestHandler = (req, res) => {
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
        return req.on('end', () => {
            const parseBody  = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            fs.writeFile('message.txt',message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location','/');
                return res.end();
            });
        });
    }
    res.setHeader('Content-Type','text/html');
    res.write('<html><body></body><h1>Hello from my Node.js server!</h1></html>');
    res.end();
}

module.exports = {
    handler: requestHandler,
    sometext: "some hard code text"
};

// module.exports = requestHandler;

// module.exports.handler = requestHandler;
// module.exports.sometext = "Some hard code text";

// exports.handler = requestHandler;
// exports.handler = "Some hard code text";