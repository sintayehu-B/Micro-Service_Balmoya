const mongoose = require("mongoose"),
  moment = require("moment");
const ReportResponseSchema = new mongoose.Schema({
  dateOfResponse: {
    type: Date,
    default: moment.utc().valueOf(),
  },
  message: {
    type: String,
    required: false,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAdmin",
  },
});

module.exports = mongoose.model("ReportResponse", ReportResponseSchema);
