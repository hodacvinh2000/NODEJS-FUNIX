const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// gach duoi chi bien nay chi cuc bo trong file nay
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://banhpow:123@testmongodb.0k7on.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log("ERROR!", err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
