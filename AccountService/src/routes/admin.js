const router = require("express").Router();
const Admin = require("../models/AdminModel/UserAdmin");
const User = require("../models/userModel/UserModel");
const userTypeAuth = require("../middleWares/userTypeAuth");
/* Importing the functions from the admin_auth.js file. */

const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  change_password,
  delete_users,
  banning_users,
  verifying_user_status,
  unVerify_user_status,
  unBanning_users,
  send_Notification_To_user,
} = require("../controllers/admin_auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

/* This is a route that is used to get the profile of the user. */

router.get(
  "/profile",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    return res.json(
      await Admin.findOne({ _id: req.user._id })
        .select(["-password"])
        .populate("report")
        .populate("verifyRequests")
        .populate("notification")
        // .populate("reportResponse")

        .exec()
    );
  }
);

/* This is a route that is used to get the profile of the user. */
router.get(
  "/current",
  user_auth,
  // userTypeAuth(["ADMIN"]),
  role_auth([roles.ADMIN]),
  (req, res, next) => {
    return res.json(serialize_user(req.user));
  }
);

/* A route that is used to register a user admin. */
router.post("/register-admin", async (req, res) => {
  return await user_register(req.body, roles.ADMIN, res);
});
/* This is a route that is used to send a notification to the user. */
router.post(
  "/send-notification",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    return await send_Notification_To_user(req.user.id, req.body, res);
  }
);

/* This is a route that is used to login a admin user. */
router.post("/login-admin", async (req, res) => {
  return await user_login(req.body, res);
});

/* This is a route that is used to update the user. */
router.put(
  "/update",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res, next) => {
    return await update_user(req.user._id, req.body, res);
  }
);
/* This is a route that is used to update the user. */
router.put(
  "/update-password",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res, next) => {
    return await change_password(
      req.user.id,
      req.body.old_password,
      req.body.new_password,
      res
    );
  }
);

/* This is a route that is used to ban the user. */
router.patch(
  "/banning-user",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    return await banning_users(req.body, res);
  }
);
/* This is a route that is used to unban the user. */
router.patch(
  "/unBanning-user",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    return await unBanning_users(req.body, res);
  }
);

/* A route that is used to verify the user. */
router.patch(
  "/verifying-user",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    return await verifying_user_status(req.body, res);
  }
);
/* This is a route that is used to unverify the user. */
router.patch(
  "/UnVerifying-user",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    return await unVerify_user_status(req.body, res);
  }
);
router.get("/users", user_auth, role_auth([roles.ADMIN]), async (req, res) => {
  try {
    const user = await User.find().select(["-password"]).exec();

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json("no user is found", err);
  }
});
/* Deleting the user. */

/* This is a route that is used to delete the user. */
router.delete(
  "/delete/user",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    return await delete_users(req.body.user, res);
  }
);

router.delete("/:id", user_auth, async (req, res, next) => {
  try {
    let x = await Admin.deleteOne({ _id: req.user._id });
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
