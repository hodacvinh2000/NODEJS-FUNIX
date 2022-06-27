const path = require("path");
const authController = require("../controllers/auth");

const express = require("express");
const router = require("./admin");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

module.exports = router;
