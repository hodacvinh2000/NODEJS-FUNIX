exports.getLogin = (req, res, next) => {
  const cookieArray = req
    .get("Cookie")
    .split(";")
    .map((c) => c.trim().split("="));
  const cookieObject = {};
  cookieArray.map((c) => (cookieObject[c[0]] = c[1]));
  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    isAuthenticated: cookieObject.loggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.setHeader("Set-Cookie", "abc=1");
  res.redirect("/");
};
