const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TimeKeepingSchema = new Schema({
  workPlace: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  status: {
    type: Boolean,
    require: true,
    default: true,
  },
  createdAt: {
    type: Date,
    require: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    require: true,
    default: new Date(),
  },
});

module.exports = mongoose.model("Timekeeping", TimeKeepingSchema);
