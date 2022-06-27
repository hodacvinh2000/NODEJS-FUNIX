const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // can change cookie value on browser
  // const cookieArray = req
  //   .get("Cookie")
  //   .split(";")
  //   .map((c) => c.trim().split("="));
  // const cookieObject = {};
  // cookieArray.map((c) => (cookieObject[c[0]] = c[1]));

  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    // isAuthenticated: cookieObject.loggedIn,
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("62b70a252b03dbbc991af28f")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
