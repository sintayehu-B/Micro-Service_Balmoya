const mongoose = require("mongoose");
const EducationalBackgroundSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, "Institution is required"],
    },
    educationLevel: {
      type: String,
      required: [true, "EducationLevel is required"],
    },
    fieldOfStudy: {
      type: String,
      required: [true, "FieldOfStudy is required"],
    },
    statedDate: {
      type: String,
      required: [true, "StatedDate is required"],
    },
    endDate: {
      type: String,
      required: [true, "EndDate is required"],
    },
    // many to many relationship
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "EducationalBackground",
  EducationalBackgroundSchema
);
