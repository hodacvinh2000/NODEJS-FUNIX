const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// sử dụng nội bộ file này
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://banhpow:kinhkong113@testmongodb.0k7on.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback(client);
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
