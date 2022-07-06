const User = require("../models/user");
const TimeKeeping = require("../models/timeKeeping");
const DayOff = require("../models/dayOff");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.getUserInfo = (req, res, next) => {
  return res.render("userInfo", {
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getTimeKeepingPage = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.working) {
      const timekeeping = await TimeKeeping.findOne({
        userId: req.user._id,
        status: true,
      });
      return res.render("timekeeping", {
        user: req.user,
        timekeeping: timekeeping,
        isAuthenticated: req.session.isLoggedIn,
      });
    } else {
      let timekeepings = await TimeKeeping.find({
        userId: req.user._id,
        status: false,
      });
      const day = new Date();
      timekeepings = timekeepings.filter((t) => equalDay(day, t.createdAt));
      return res.render("timekeeping", {
        user: req.user,
        timekeepings: timekeepings,
        workTime: workTimeInDate(timekeepings, day),
        isAuthenticated: req.session.isLoggedIn,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.postAddTimekeeping = (req, res, next) => {
  const workPlace = req.body.workPlace;
  const userId = req.user._id;

  // add a timekeeping
  const timeKeeping = new TimeKeeping({
    workPlace: workPlace,
    userId: userId,
  });
  timeKeeping
    .save()
    .then((result) => {
      const user = req.user;
      return user.addTimekeeping(result);
    })
    .then(() => {
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.checkout = async (req, res, next) => {
  try {
    const timekeeping = await TimeKeeping.findOne({
      userId: req.user._id,
      status: true,
    });
    timekeeping.status = false;
    timekeeping
      .save()
      .then(() => {
        const user = req.user;
        user.working = !user.working;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
      });
  } catch (e) {
    console.log(e);
  }
};

exports.addDayOff = (req, res, next) => {
  const dayoff = new Date(req.body.dayoff);
  const hours = Number(req.body.hours);
  const reason = req.body.reason;
  const onLeave = new DayOff({
    userId: req.user._id,
    dayoff: dayoff,
    hours: hours,
    reason: reason,
  });
  if (req.user.annualLeave * 8 < hours) {
    return res.redirect("/");
  } else {
    return onLeave
      .save()
      .then(() => {
        const user = req.user;
        user.annualLeave = user.annualLeave - hours / 8;
        user
          .save()
          .then(() => {
            return res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  }
};

exports.updateUser = (req, res, next) => {
  const user = req.user;
  const image = req.file;
  if (image) {
    user.image = image.path;
    return user
      .save()
      .then(() => {
        return res.redirect("/userInfo");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    return res.redirect("/userInfo");
  }
};

/*
  Tra cứu thông tin giờ làm, lương tháng
  1. Lấy danh sách giờ đã làm (timekeepings)
  2. Lấy tổng giờ làm trong một ngày
  3. Lấy số giờ đăng ký nghỉ (annualLeave) của từng ngày + tổng số giờ làm trong ngày => phiên làm cuối cùng trong ngày
  4. Tính lương tháng
*/
const ITEMS_PER_PAGE = 2;
exports.workTimeAndSalary = async (req, res, next) => {
  try {
    let page = +req.query.page || 1;
    let timekeepings = await TimeKeeping.find({ userId: req.user._id }).sort([
      ["createdAt", "asc"],
    ]);
    // .skip((page - 1) * ITEMS_PER_PAGE)
    // .limit(ITEMS_PER_PAGE);
    let manager = await User.findById(req.user.managedBy);
    let dayoffs = await DayOff.find({ userId: req.user._id });
    if (timekeepings.length > 0) {
      let t = [];
      let day = timekeepings[0].createdAt;
      let workTime = 0;
      for (i = 0; i < timekeepings.length; i++) {
        if (i === timekeepings.length - 1) {
          // là lần cuối nhưng cùng ngày
          if (equalDay(day, timekeepings[i].createdAt)) {
            let totalDayoff = getTotalDayoff(
              dayoffs,
              timekeepings[i].createdAt
            );
            if (i >= 1) {
              t.push({
                timekeeping: timekeepings[i - 1],
                workedTime: convertTime(lengthOfWorkTime(timekeepings[i - 1])),
                annualLeave: totalDayoff,
              });
            }
            t.push({
              timekeeping: timekeepings[i],
              annualLeave: totalDayoff,
              workedTime: convertTime(lengthOfWorkTime(timekeepings[i])),
              totalTime: (totalDayoff + workTime).toFixed(1),
              overTime: (totalDayoff + workTime > 8
                ? totalDayoff + workTime - 8
                : 0
              ).toFixed(1),
            });
          }
          // là lần cuối nhưng khác ngày
          else {
            if (
              !equalDay(
                timekeepings[i].createdAt,
                timekeepings[i - 1].createdAt
              )
            ) {
              let preTotalDayoff = getTotalDayoff(
                dayoffs,
                timekeepings[i - 1].createdAt
              );
              // push lần cuối của ngày trước
              t.push({
                timekeeping: timekeepings[i - 1],
                annualLeave: preTotalDayoff,
                workedTime: convertTime(lengthOfWorkTime(timekeepings[i - 1])),
                totalTime: (preTotalDayoff + workTime).toFixed(1),
                overTime: (preTotalDayoff + workTime > 8
                  ? preTotalDayoff + workTime - 8
                  : 0
                ).toFixed(1),
              });
            }
            // push ngày này
            let totalDayoff = getTotalDayoff(
              dayoffs,
              timekeepings[i].createdAt
            );
            workTime = parseFloat(lengthOfWorkTime(timekeepings[i]) / 60 / 60);
            t.push({
              timekeeping: timekeepings[i],
              annualLeave: totalDayoff,
              workedTime: convertTime(lengthOfWorkTime(timekeepings[i])),
              totalTime: (totalDayoff + workTime).toFixed(1),
              overTime: (totalDayoff + workTime > 8
                ? totalDayoff + workTime - 8
                : 0
              ).toFixed(1),
            });
          }
        } else {
          if (!equalDay(day, timekeepings[i].createdAt)) {
            let preTotalDayoff = getTotalDayoff(
              dayoffs,
              timekeepings[i - 1].createdAt
            );
            // push lần cuối của ngày trước
            t.push({
              timekeeping: timekeepings[i - 1],
              annualLeave: preTotalDayoff,
              workedTime: convertTime(lengthOfWorkTime(timekeepings[i - 1])),
              totalTime: (preTotalDayoff + workTime).toFixed(1),
              overTime: (preTotalDayoff + workTime > 8
                ? preTotalDayoff + workTime - 8
                : 0
              ).toFixed(1),
            });
            // set workTime
            workTime = parseFloat(lengthOfWorkTime(timekeepings[i]) / 60 / 60);
          } else {
            workTime += parseFloat(lengthOfWorkTime(timekeepings[i]) / 60 / 60);
            let totalDayoff = getTotalDayoff(
              dayoffs,
              timekeepings[i].createdAt
            );
            if (i >= 1) {
              t.push({
                timekeeping: timekeepings[i - 1],
                annualLeave: totalDayoff,
                workedTime: convertTime(lengthOfWorkTime(timekeepings[i - 1])),
              });
            }
          }
        }
        day = timekeepings[i].createdAt;
      }
      // Tính lương tháng
      let salary = [];
      let month = t[0].timekeeping.createdAt;
      let salaryOfMonth = req.user.salaryScale * 3000000;
      let totalMissHours = 0;
      let totalOverTime = 0;
      for (i = 0; i < t.length; i++) {
        // cung thang
        if (equalMonth(t[i].timekeeping.createdAt, month)) {
          if (t[i].totalTime && t[i].overTime) {
            let missHours =
              Number(t[i].totalTime) < 8 ? 8 - Number(t[i].totalTime) : 0;
            salaryOfMonth += (Number(t[i].overTime) - missHours) * 200000;
            totalMissHours += missHours;
            totalOverTime += Number(t[i].overTime);
          }
          // phan tu cuoi cung
          if (i === t.length - 1) {
            // push
            salary.push({
              month: month.getMonth() + 1,
              year: month.getFullYear(),
              salaryScale: req.user.salaryScale,
              missHours: totalMissHours,
              overTime: totalOverTime,
              salary: salaryOfMonth,
            });
          }
        } else {
          salary.push({
            month: month.getMonth() + 1,
            year: month.getFullYear(),
            salaryScale: req.user.salaryScale,
            missHours: totalMissHours,
            overTime: totalOverTime,
            salary: salaryOfMonth,
          });
          if (i === t.length + 1) {
            let missHours =
              Number(t[i].totalTime) < 8 ? 8 - Number(t[i].totalTime) : 0;
            salary.push({
              month: t[i].timekeeping.createdAt.getMonth() + 1,
              year: t[i].timekeeping.createdAt.getFullYear(),
              salaryScale: req.user.salaryScale,
              missHours: totalMissHours,
              overTime: totalOverTime,
              salary:
                req.user.salaryScale * 3000000 +
                (Number(t[i].overTime) - missHours) * 200000,
            });
          }
          month = t[i].timekeeping.createdAt;
          salaryOfMonth = req.user.salaryScale * 3000000;
          totalMissHours = 0;
          totalOverTime = 0;
        }
      }
      let totalItems = await TimeKeeping.find({
        userId: req.user._id,
      }).countDocuments();
      let pagination = {
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        nextPage: page + 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      };
      let reqmonth = req.query.month;
      let reqyear = req.query.year;
      if (reqmonth && reqyear) {
        return res.render("worktimeAndSalary", {
          manager: manager,
          timekeepings: t.slice(
            (page - 1) * ITEMS_PER_PAGE,
            page * ITEMS_PER_PAGE
          ),
          salary: salary.find(
            (s) => s.month === Number(reqmonth) && s.year === Number(reqyear)
          ),
          pagination: pagination,
          isAuthenticated: req.session.isLoggedIn,
        });
      }
      return res.render("worktimeAndSalary", {
        manager: manager,
        timekeepings: t.slice(
          (page - 1) * ITEMS_PER_PAGE,
          page * ITEMS_PER_PAGE
        ),
        salary: null,
        pagination: pagination,
        isAuthenticated: req.session.isLoggedIn,
      });
    } else {
      return res.render("worktimeAndSalary", {
        manager: manager,
        timekeepings: [],
        salary: null,
        isAuthenticated: req.session.isLoggedIn,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.getCovidPage = async (req, res, next) => {
  let listStaff = await User.find({ managedBy: req.user._id });
  let selectedUserId = req.query.user;
  let selectedUser = selectedUserId
    ? await User.findById(selectedUserId)
    : req.user;
  return res.render("covid", {
    user: req.user,
    listStaff: listStaff,
    selectedUser: selectedUser,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.registerBodyTemperature = (req, res, next) => {
  const temperature = req.body.temperature;
  req.user.temperature.push({ value: Number(temperature) });
  return req.user
    .save()
    .then((result) => {
      console.log(result);
      return res.redirect("/covid");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.registerVaccine = (req, res, next) => {
  const typeOfVaccine = req.body.typeOfVaccine;
  const date = new Date(req.body.date);
  const serial = Number(req.body.serial);
  req.user.vaccine.push({
    date: date,
    typeOfVaccine: typeOfVaccine,
    serial: serial,
  });
  return req.user
    .save()
    .then((result) => {
      console.log(result);
      return res.redirect("/covid");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.registerCovid = (req, res, next) => {
  const date = new Date(req.body.date);
  const status = Boolean(req.body.status);
  req.user.haveCovid.push({
    date: date,
    status: status,
  });
  return req.user
    .save()
    .then((result) => {
      console.log(result);
      return res.redirect("/covid");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.exportPDFCovid = async (req, res, next) => {
  const userId = req.query.user;
  const user = await User.findById(userId);
  const covidFileName = "covid-" + userId + ".pdf";
  const covidFilePath = path.join("covidPDF", covidFileName);

  const pdfDoc = new PDFDocument({ font: "Times-Roman" });
  res.setHeader(
    "Content-Disposition",
    'inline; filename="' + covidFileName + '"'
  );
  pdfDoc.pipe(fs.createWriteStream(covidFilePath));
  pdfDoc.pipe(res);

  let temperatureText = "";
  let vaccineText = "";
  let haveCovidText = "";
  user.temperature.map((item) => {
    temperatureText +=
      "Time: " +
      getDate(item.time) +
      " " +
      getTime(item.time) +
      " -- " +
      "Value: " +
      item.value +
      "\n";
  });
  user.vaccine.map((item) => {
    vaccineText +=
      "Date: " +
      getDate(item.date) +
      " -- " +
      "Type: " +
      item.typeOfVaccine +
      " -- Serial: " +
      item.serial +
      "\n";
  });
  user.haveCovid.map((item) => {
    const haveCovid = item.status ? "Haved Covid \n" : "No Covid \n";
    haveCovidText +=
      "Date: " + getDate(item.date) + " -- HaveCovid: " + haveCovid;
  });
  pdfDoc.fontSize(26).text("Name: " + user.name, { underline: true }, 100, 80);
  pdfDoc.text("---------------------");
  pdfDoc.fontSize(26).text("Temperature:", { underline: true });
  pdfDoc.fontSize(14).text(temperatureText);
  pdfDoc.text("---------------------");
  pdfDoc.fontSize(26).text("Vaccine:", { underline: true });
  pdfDoc.fontSize(14).text(vaccineText);
  pdfDoc.text("---------------------");
  pdfDoc.fontSize(26).text("Haved Covid:", { underline: true });
  pdfDoc.fontSize(14).text(haveCovidText);
  pdfDoc.text("---------------------");
  pdfDoc.end();
  const file = fs.createReadStream(covidFilePath);
  file.pipe(res);
};

const getTotalDayoff = (dayoffs, day) => {
  dayoffs = dayoffs.filter((d) => equalDay(d.dayoff, day));
  let totalDayoff = 0;
  dayoffs.map((d) => (totalDayoff += d.hours));
  return totalDayoff;
};

const getTime = (day) => {
  let time = day.getHours() + ":" + day.getMinutes();
  return time;
};

const getDate = (day) => {
  let date =
    day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();
  return date;
};

const workTimeInDate = (timekeepings, day) => {
  const listTKP = timekeepings.filter((t) => equalDay(day, t.createdAt));
  let totalTime = 0;
  listTKP.forEach((t) => {
    if (!t.status) {
      totalTime = totalTime + lengthOfWorkTime(t);
    }
  });
  return convertTime(totalTime);
};

const convertTime = (time) => {
  const hours = Math.floor(time / 60 / 60);
  const minutes = Math.floor(time / 60 - hours * 60);
  const seconds = Math.floor(time - hours * 60 * 60 - minutes * 60);
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
};

const equalDay = (a, b) => {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
};

const equalMonth = (a, b) => {
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
};

const lengthOfWorkTime = (timekeeping) => {
  return (timekeeping.updatedAt - timekeeping.createdAt) / 1000;
};
