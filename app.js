// Import package
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");

// Import routes and models
const User = require("./models/user");
const userRoutes = require("./routers/user");
const authRoutes = require("./routers/auth");

const MONGODB_URI =
  "mongodb+srv://banhpow:kinhkong113@testmongodb.0k7on.mongodb.net/nodejs-asm";
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime().toString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// set type of template
app.set("view engine", "ejs");
app.set("views", "views");

// set path css and js
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
app.use(
  "/js",
  express.static(
    path.join(__dirname, "node_modules/bootstrap-datepicker/dist/js")
  )
);
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "banhpowsecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  }
});

app.use(userRoutes);
app.use(authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Hồ Đắc Vinh",
    //       email: "hodacvinh2000@gmail.com",
    //       password: "123123",
    //       doB: new Date("2000-07-17"),
    //       salaryScale: 1.0,
    //       startDate: new Date("2022-06-20"),
    //       department: "IT",
    //       annualLeave: 12.3,
    //       image:
    //         "https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/278367292_831472097809307_403408694811896745_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=1VjkV2qXBfEAX8kPqVT&_nc_ht=scontent.fdad3-1.fna&oh=00_AT-XzB0-Jsy80TVMW7q23dNQsWKh9w5TYZr-3XdSE1_rrg&oe=62B4FE3E",
    //     });
    //     user.save();
    //   }
    // });
    app.listen(process.evn.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
