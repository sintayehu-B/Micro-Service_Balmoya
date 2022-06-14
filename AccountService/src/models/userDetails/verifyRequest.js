const mongoose = require("mongoose");
const VerifyRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  verificationDocument: {
    type: String,
    required: [true, "MUST BE FIELD"],
  },
  verificationStatus: {
    type: String,
    enum: ["failed", "verified", "pending"],
    default: "pending",
  },
});

module.exports = mongoose.model("VerifyRequest", VerifyRequestSchema);
