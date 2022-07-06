const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
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
          required: true,
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
          required: true,
        },
      },
    ],
  },
  temperature: [
    {
      time: {
        type: Date,
        required: true,
        default: new Date(),
      },
      value: {
        type: Number,
        required: true,
      },
    },
  ],
  vaccine: [
    {
      date: {
        type: Date,
        required: true,
      },
      typeOfVaccine: {
        type: String,
        required: true,
      },
      serial: {
        type: Number,
        required: true,
      },
    },
  ],
  haveCovid: [
    {
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
      },
    },
  ],
  role: {
    type: String,
    required: true,
  },
  managedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
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
