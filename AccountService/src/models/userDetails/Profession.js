const mongoose = require("mongoose");
const ProfessionSchema = new mongoose.Schema(
  {
    professionName: {
      type: String,
      required: [true, "Profession is required"],
    },
    tag: {
      type: Array,
      default: [],
      required: [false, "Tag is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profession", ProfessionSchema);
