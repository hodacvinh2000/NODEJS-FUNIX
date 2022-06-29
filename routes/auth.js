const express = require("express");
const validator = require("../middleware/validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", validator.checkLoginForm, authController.postLogin);

router.post("/signup", validator.checkSignupForm, authController.postSignup);

router.post("/logout", authController.postLogout);

module.exports = router;
