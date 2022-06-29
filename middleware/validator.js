const { check, body } = require("express-validator/check");
const User = require("../models/user");

const checkSignupForm = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      // if (value === "test@test.com") {
      //   throw new Error("This email address if forbidden");
      // }
      // return true;
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(
            "Email exists already, please pick a different one."
          );
        }
      });
    }),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 charaters."
  )
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw Error("Passwords have to match!");
    }
    return true;
  }),
];

const checkLoginForm = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      // if (value === "test@test.com") {
      //   throw new Error("This email address if forbidden");
      // }
      // return true;
      return User.findOne({ email: value }).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject("Email do not exists.");
        }
      });
    }),
  check("password").custom((value, { req }) => {
    return User.findOne({ email: req.body.email, password: value }).then(
      (userDoc) => {
        if (!userDoc) {
          return Promise.reject("Wrong password.");
        }
      }
    );
  }),
];

exports.checkLoginForm = checkLoginForm;
exports.checkSignupForm = checkSignupForm;
