const router = require("express").Router();
const Reviews = require("../models/Reviews/reviews");

/* Importing the functions from the Company.js file. */
const {
  user_auth,
  serialize_user,
  role_auth,

  addReviewsToUser,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");
const UserModel = require("../models/userModel/UserModel");

/* This is a route that is used to post the reviews of the user. */
router.post(
  "/create",
  user_auth,
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  async (req, res) => {
    try {
      let reviews = new Reviews({
        ...req.body,
        revieweeCustomerId: req.body.revieweeCustomerId,
        reviewerCustomerId: req.user.id,
      });
      await addReviewsToUser(req.body.revieweeCustomerId, reviews.id);
      let save_reviews = await reviews.save();
      return res.status(201).json({
        message: "reviews Created Successfully.",
        success: true,
        reviews: save_reviews,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't create the task",
        success: false,
      });
    }
  }
);

router.delete("/:id", user_auth, async (req, res, next) => {
  try {
    let x = await Reviews.deleteOne({ _id: req.user._id });
    console.log(x);
    return res.status(200).json({
      message: "Deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error deleting.",
      success: false,
    });
  }
});

module.exports = router;
