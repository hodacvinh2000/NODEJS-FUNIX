const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DayOffSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  dayoff: {
    type: Date,
    require: true,
  },
  hours: {
    type: Number,
    require: true,
  },
  reason: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Dayoff", DayOffSchema);
