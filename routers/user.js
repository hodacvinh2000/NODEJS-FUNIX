const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

// get user infomation route
router.get("/userInfo", userController.getUserInfo);

// get timekeeping page
router.get("/", userController.getTimeKeepingPage);

// post timekeeping
router.post("/add-timekeeping", userController.postAddTimekeeping);

// checkout
router.get("/checkout", userController.checkout);

// add dayoff
router.post("/add-dayoff", userController.addDayOff);

// post update user
router.post("/updateUser", userController.updateUser);

// workTime and Salary
router.get("/workTimeAndSalary", userController.workTimeAndSalary);

// covid route
router.get("/covid", userController.getCovidPage);

// registerBodyTemperature
router.post("/registerBodyTemperature", userController.registerBodyTemperature);

// registerVaccine
router.post("/registerVaccine", userController.registerVaccine);

// registerCovid
router.post("/registerCovid", userController.registerCovid);

module.exports = router;
