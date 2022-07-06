const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DayOffSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dayoff: {
    type: Date,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Dayoff", DayOffSchema);
