const router = require("express").Router();
const Report = require("../models/Reports/reports");
/* Importing the functions from the Company.js file. */
const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  change_password,
  addReportToUser,
} = require("../controllers/auth");
const { addReportToAdmin, getID } = require("../controllers/admin_auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");
// const UserModel = require("../models/userModel/UserModel");

// router.get(
//   "/reports",
//   user_auth,
//   role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
//   async (req, res) => {
//     return res.json(await Report.find({ report_Id: UserModel.report_Id }));
//   }
// );

router.post(
  "/create",
  user_auth,
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  async (req, res) => {
    try {
      let reports = new Report({
        ...req.body,
        reporter: req.user.id,
      });
      // const id = getID();
      await addReportToAdmin(reports.id);
      await addReportToUser(req.user.id, reports.id);
      let save_reports = await reports.save();
      return res.status(201).json({
        message: "experience Created Successfully.",
        success: true,
        reports: save_reports,
      });
    } catch (error) {
      // console.log(error);
      return res.status(500).json({
        message: "Couldn't create the report",
        success: false,
      });
    }
  }
);

// router.delete("/:id", user_auth, async (req, res, next) => {
//   try {
//     let x = await Report.deleteOne({ _id: req.user._id });
//     console.log(x);
//     return res.status(200).json({
//       message: "Deleted successfully.",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Error deleting.",
//       success: false,
//     });
//   }
// });

module.exports = router;
