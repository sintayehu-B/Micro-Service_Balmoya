const router = require("express").Router();
const userEducationalBackground = require("../models/userDetails/EducationalBackground");
const {
  user_auth,
  role_auth,
  addEducationalBackground,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

router.get("/:id", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
  try {
    const education = await userEducationalBackground.findById({
      _id: req.params.id,
    });
    res.status(200).json(education);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* This is a route that is used to create the educational background of the user. */
router.post("/", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
  try {
    let educationalBackground = new userEducationalBackground({
      ...req.body,
      user: req.user._id,
    });
    await addEducationalBackground(req.user.id, educationalBackground.id);
    let save_educationalBackground = await educationalBackground.save();
    return res.status(201).json({
      message: "educationalBackground Created Successfully.",
      success: true,
      educationalBackground: save_educationalBackground,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Couldn't create the task",
      success: false,
    });
  }
});

/* Updating the educational background of the user. */
router.patch(
  "/:id",
  user_auth,
  role_auth([roles.EMPLOYEE]),
  async (req, res) => {
    let educationalBackground = await userEducationalBackground.findById(
      req.params.id
    );
    let _educationalBackground = req.body;
    educationalBackground.institution =
      _educationalBackground.institution || educationalBackground.institution;
    educationalBackground.educationLevel =
      _educationalBackground.educationLevel ||
      educationalBackground.educationLevel;
    educationalBackground.fieldOfStudy =
      _educationalBackground.fieldOfStudy || educationalBackground.fieldOfStudy;
    educationalBackground.statedDate =
      _educationalBackground.statedDate || educationalBackground.statedDate;
    educationalBackground.endDate =
      _educationalBackground.endDate || educationalBackground.endDate;
    await educationalBackground.save();

    return res.status(201).json({
      message: "educationalBackground updated.",
      success: true,
      educationalBackground,
    });
  }
);

/* Deleting the educational background of the user. */
// router.delete("/:id", user_auth, async (req, res, next) => {
//   try {
//     let x = await userEducationalBackground.deleteOne({
//       _id: req.params.id,
//     });
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
