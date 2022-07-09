module.exports = (req, res, next) => {
  if (!(req.user.role === "manager")) {
    res.write("Can not access!");
    return res.end();
  }
  next();
};
