const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const userRoutes = require("./routers/user");

const app = express();

// set type of template
app.set("view engine", "ejs");
app.set("views", "views");

// set path css and js
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
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

app.use((req, res, next) => {
  User.findById("62b70703d6ef730de189da6e")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(userRoutes);

mongoose
  .connect(
    "mongodb+srv://banhpow:kinhkong113@testmongodb.0k7on.mongodb.net/nodejs-asm1?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Hồ Đắc Vinh",
          doB: new Date("2000-07-17"),
          salaryScale: 1.0,
          startDate: new Date("2022-06-20"),
          department: "IT",
          annualLeave: 12.3,
          image:
            "https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/278367292_831472097809307_403408694811896745_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=1VjkV2qXBfEAX8kPqVT&_nc_ht=scontent.fdad3-1.fna&oh=00_AT-XzB0-Jsy80TVMW7q23dNQsWKh9w5TYZr-3XdSE1_rrg&oe=62B4FE3E",
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
