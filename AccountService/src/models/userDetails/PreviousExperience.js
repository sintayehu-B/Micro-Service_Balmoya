const mongoose = require("mongoose");
const PreviousExperienceSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: [true, "OrganizationName is required"],
    },
    dateStarted: {
      type: String,
      required: [true, "DateStarted is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    currentlyActive: {
      type: Boolean,
      required: [true, "currentlyActive is required"],
    },
    // referenceId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "References",
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PreviousExperience", PreviousExperienceSchema);
