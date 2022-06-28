const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value) => {
        if (value === "test@test.com") {
          throw new Error("This email address if forbidden");
        }
        return true;
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 charaters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
