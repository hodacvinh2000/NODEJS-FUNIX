const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  if (!req.session.user) {
    res.render("auth/login", {
      user: null,
      path: "/login",
      pageTitle: "login",
      isAuthenticated: false,
    });
  } else res.redirect(req.session.currentPage);
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (user && user.password === password) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
          if (err) console.log(err);
          if (req.session.currentPage) res.redirect(req.session.currentPage);
          else {
            res.redirect("/");
          }
        });
      } else {
        console.log("Wrong email or password!");
      }
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
