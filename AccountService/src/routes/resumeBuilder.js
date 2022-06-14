const router = require("express").Router();
const ResumeBuilder = require("../models/ResumeBuilder/resumeBuilder");

/* Importing the functions from the Company.js file. */
const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  change_password,
  addResumeToUser,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

/* This is a route that is used to get the user's resume. */
router.get("/", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
  return res.json(await ResumeBuilder.find({ user: req.user.resumeBuilder }));
});

router.post("/", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
  try {
    let resume = new ResumeBuilder({
      ...req.body,
      user: req.user.id,
    });
    await addResumeToUser(req.user.id, resume.id);
    let save_resume = await resume.save();
    return res.status(201).json({
      message: "Resume Created Successfully.",
      success: true,
      resume: save_resume,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Couldn't create the resume",
      success: false,
    });
  }
});

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
