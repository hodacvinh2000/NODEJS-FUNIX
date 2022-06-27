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
  req.session.isLoggedIn = true;
  res.redirect("/");
};
