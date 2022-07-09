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
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  confirm: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

module.exports = mongoose.model("Timekeeping", TimeKeepingSchema);
