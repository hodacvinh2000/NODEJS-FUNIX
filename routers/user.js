const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

router.get("/index", (req, res, next) => {
  return res.render("index");
});

// get user infomation route
router.get("/userInfo", isAuth, userController.getUserInfo);

// get timekeeping page
router.get("/", isAuth, userController.getTimeKeepingPage);

// post timekeeping
router.post("/add-timekeeping", isAuth, userController.postAddTimekeeping);

// checkout
router.get("/checkout", isAuth, userController.checkout);

// add dayoff
router.post("/add-dayoff", isAuth, userController.addDayOff);

// post update user
router.post("/updateUser", isAuth, userController.updateUser);

// workTime and Salary
router.get("/workTimeAndSalary", isAuth, userController.workTimeAndSalary);

// covid route
router.get("/covid", isAuth, userController.getCovidPage);

// registerBodyTemperature
router.post(
  "/registerBodyTemperature",
  isAuth,
  userController.registerBodyTemperature
);

// registerVaccine
router.post("/registerVaccine", isAuth, userController.registerVaccine);

// registerCovid
router.post("/registerCovid", isAuth, userController.registerCovid);

router.get("/covidPDF", isAuth, userController.exportPDFCovid);

module.exports = router;
