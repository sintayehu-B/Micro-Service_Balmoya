const mongoose = require("mongoose"),
  moment = require("moment");
const NotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Must be field"],
    default: "",
  },
  date: {
    type: Date,
    default: moment.utc().valueOf(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAdmin",
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
