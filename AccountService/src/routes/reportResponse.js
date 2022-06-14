const router = require("express").Router();
const ReportResponse = require("../models/Reports/reports");

/* Importing the functions from the Company.js file. */
const { addReportResponseToAdmin } = require("../controllers/admin_auth");
const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  change_password,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

// router.get("/", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
//   return res.json(await userProfession.find({ user: req.user._id }));
// });

/* This is a route that is used to get a report response. */
router.get(
  "/:id",
  user_auth,
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  async (req, res) => {
    try {
      const rs = await ReportResponse.findById({
        _id: req.params.id,
      });
      res.status(200).json(rs);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
/* This is a route that is used to create a report response. */
/**
 * Admin report Response post
 */
router.post(
  "/reportResponse",
  user_auth,
  role_auth([roles.ADMIN]),
  async (req, res) => {
    try {
      let rs = new ReportResponse({
        ...req.body,
        admin: req.user._id,
      });
      await addReportResponseToAdmin(req.user.id, rs.id);
      let save_rs = await rs.save();
      return res.status(201).json({
        message: "rs Created Successfully.",
        success: true,
        rs: save_rs,
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

router.delete(
  "/:id",
  user_auth,
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  async (req, res, next) => {
    try {
      let x = await ReportResponse.deleteOne({ _id: req.user._id });
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
  }
);

module.exports = router;
