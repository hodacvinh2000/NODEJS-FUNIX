const { check, body } = require("express-validator/check");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const checkSignup = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(
            "Email exists already, please pick a different one."
          );
        }
      });
    })
    .trim(),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 charaters."
  )
    .isLength({ min: 5 })
    // .isAlphanumeric()
    .trim(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw Error("Passwords have to match!");
      }
      return true;
    }),
];

const checkLogin = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom((value) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject("Email do not exists.");
        }
      });
    }),
  check("password")
    .trim()
    .custom((value, { req }) => {
      return User.findOne({ email: req.body.email }).then(async (userDoc) => {
        const isRightPassword = await bcrypt.compare(value, userDoc.password);
        if (!isRightPassword) {
          return Promise.reject("Wrong password.");
        }
      });
    }),
];

const checkAddProduct = [
  body("title").isString().isLength({ min: 3 }).trim(),
  body("imageUrl").isURL(),
  body("price").isFloat(),
  body("description").isString().trim().isLength({ min: 5, max: 400 }),
];

const checkEditProduct = [
  body("title").isString().isLength({ min: 3 }).trim(),
  body("imageUrl").isURL(),
  body("price").isFloat(),
  body("description").isString().trim().isLength({ min: 5, max: 400 }),
];

exports.checkLogin = checkLogin;
exports.checkSignup = checkSignup;
exports.checkAddProduct = checkAddProduct;
exports.checkEditProduct = checkEditProduct;
