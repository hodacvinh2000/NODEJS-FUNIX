const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  doB: {
    type: Date,
    required: true,
  },
  salaryScale: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  annualLeave: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  working: {
    type: Boolean,
    required: true,
    default: false,
  },
  timekeepings: {
    items: [
      {
        tkpId: {
          type: Schema.Types.ObjectId,
          ref: "Timekeeping",
          require: true,
        },
      },
    ],
  },
  dayoffs: {
    items: [
      {
        dayoffId: {
          type: Schema.Types.ObjectId,
          ref: "Dayoff",
          require: true,
        },
      },
    ],
  },
  temperature: [
    {
      time: {
        type: Date,
        require: true,
        default: new Date(),
      },
      value: {
        type: Number,
        require: true,
      },
    },
  ],
  vaccine: [
    {
      date: {
        type: Date,
        require: true,
      },
      typeOfVaccine: {
        type: String,
        require: true,
      },
      serial: {
        type: Number,
        require: true,
      },
    },
  ],
  haveCovid: [
    {
      date: {
        type: Date,
        require: true,
      },
      status: {
        type: Boolean,
        require: true,
      },
    },
  ],
});

userSchema.methods.addTimekeeping = function (timekeeping) {
  this.timekeepings.items.push({ tkpId: timekeeping._id });
  this.working = !this.working;
  return this.save();
};

userSchema.methods.addDayoff = function (dayoff) {
  this.dayoffs.items.push({ dayoffId: dayoff._id });
  this.annualLeave -= dayoff.hours / 8;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
