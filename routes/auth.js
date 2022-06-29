const express = require("express");
const validator = require("../middleware/validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", validator.checkLogin, authController.postLogin);

router.post("/signup", validator.checkSignup, authController.postSignup);

router.post("/logout", authController.postLogout);

module.exports = router;
