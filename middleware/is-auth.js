module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    if (req.url !== "/login") {
      req.session.currentPage = req.url;
    } else {
      req.session.currentPage = "/";
    }
    return res.redirect("/login");
  }
  next();
};
