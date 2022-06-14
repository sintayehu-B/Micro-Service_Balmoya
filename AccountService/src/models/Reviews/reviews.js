const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    reviewerCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "reviewerId is required"],
    },
    revieweeCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "revieweeId is required"],
      // unique: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    comment: {
      type: String,
      required: [false, "Password is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserReview", ReviewSchema);
