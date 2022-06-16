const mongoose = require("mongoose");
const SecurityQuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   required: true
    },
    favoritePlace: {
      type: String,
      required: false,
    },
    childhoodMemory: {
      type: String,
      required: [false, "childhood Memory is required"],
    },
    mother_Maiden_Name: {
      type: String,
      required: [false, "mother's Maiden Name is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SecurityQuestion", SecurityQuestionSchema);
