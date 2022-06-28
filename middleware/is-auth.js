module.exports = (req, res, next) => {
  if (!req.user.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};
