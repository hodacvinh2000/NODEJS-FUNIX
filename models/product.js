const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        console.log(fileContent);
        if (err) {
            cb([]);
        } 
        else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    // cb is async things
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}