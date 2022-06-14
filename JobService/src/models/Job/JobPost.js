const mongoose = require("mongoose");
const JobPostSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    tag: {
      type: Array,
      default: [],
      required: false,
    },
    status: {
      type: Boolean,
      default: true,
      // required: false,
    },
    // new Field
    salary: {
      type: String,
      required: [true, "A company must provide salary"],
    },
    // new field
    companySize: {
      type: String,
      required: [true, "A company must few employees"],
    },
    jopAppliedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApplyForJob",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPost", JobPostSchema);
