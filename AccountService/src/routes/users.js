const router = require("express").Router();
const User = require("../models/userModel/UserModel");

const Notification = require("../models/Notification/Notification");
// const path = require("path");

/* Importing the functions from the Company.js file. */
const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  check_for_banned_user,
  change_password,
  get_verified,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

/* This is a route that is used to get the reviews of the user. */
router.get(
  "/reviews",
  user_auth,
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id).populate("reviews");
      const { reviews } = user._doc;
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
/* This is a route that is used to get the profile of the user. */

router.get(
  "/profile",
  user_auth,
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  async (req, res) => {
    return res.json(
      await User.findOne({ _id: req.user._id })
        .select(["-password"])
        .populate("previousExperience")
        .populate("profession")
        .populate("educationalBackground")
        .populate("resumeBuilder")
        .populate("referenceId")
        .populate("jobsPosted")
        .populate("notification")
        .populate("report_Id")
        .populate("profilePicture")
        .populate("securityQuestion")
        .exec()
    );
  }
);

/* This is a route that is used to get the profile of the user. */
router.get(
  "/current",
  user_auth,
  // userTypeAuth(["ADMIN"]),
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  (req, res, next) => {
    return res.json(serialize_user(req.user));
  }
);
/* A route that is used to register a user Employer. */
router.post("/register-userCompany", async (req, res) => {
  return await user_register(req.body, roles.EMPLOYER, res);
});

/* This is a route that is used to register a user Employee. */
router.post("/register-userEmployee", async (req, res) => {
  return await user_register(req.body, roles.EMPLOYEE, res);
});

/* This is a route that is used to login the user. */
router.post("/login", check_for_banned_user(User), async (req, res) => {
  return await user_login(req.body, res);
});

/* This is a route that is used to update the user. */
router.put(
  "/update",
  user_auth,
  role_auth([roles.EMPLOYER, roles.EMPLOYEE]),
  async (req, res, next) => {
    return await update_user(req.user._id, req.body, res);
  }
);

/* This is a route that is used to update the user. */
router.put(
  "/update-password",
  user_auth,
  role_auth([roles.EMPLOYER, roles.EMPLOYEE]),
  async (req, res, next) => {
    return await change_password(
      req.user.id,
      req.body.old_password,
      req.body.new_password,
      res
    );
  }
);

/* This is a route that is used to get the profile of the user. */

router.get("/friendsId", async (req, res) => {
  const user_id = req.query.user_id;
  const fullName = req.query.fullName;
  try {
    const user = user_id
      ? await User.findById(user_id).exec()
      : await User.findOne({ fullName: fullName }).exec();
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error });
  }
});

/* Deleting the user. */
router.delete("/user", user_auth, async (req, res, next) => {
  try {
    let x = await User.deleteOne({ _id: req.user._id });
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

router.get(
  "/singleUser",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    try {
      const user = await User.findById(req.body.user).populate().exec();
      const { password, ...others } = user._doc;
      res.status(200).json({ others: others, success: true });
    } catch (err) {
      res.status(404).json("no user is found", err);
    }
  }
);
module.exports = router;
