const router = require("express").Router();
const userPreviousExperience = require("../models/userDetails/PreviousExperience");
const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  change_password,
  addPreviousExperience,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

// router.get("/", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
//   return res.json(await userPreviousExperience.find({ user: req.user._id }));
// });

router.get("/:id", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
  try {
    const experience = await userPreviousExperience
      .findById({
        _id: req.params.id,
      })
      .populate("previousExperience");
    res.status(200).json(experience);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post(
  "/experience",
  user_auth,
  role_auth([roles.EMPLOYEE]),
  async (req, res) => {
    try {
      let experience = new userPreviousExperience({
        ...req.body,
        user: req.user.id,
      });
      await addPreviousExperience(req.user.id, experience.id);
      let save_experience = await experience.save();
      return res.status(201).json({
        message: "experience Created Successfully.",
        success: true,
        experience: save_experience,
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

router.patch(
  "/:id",
  user_auth,
  role_auth([roles.EMPLOYEE]),
  async (req, res) => {
    let experience = await userPreviousExperience.findById(req.params.id);
    let _experience = req.body;
    experience.institution = _experience.institution || experience.institution;
    experience.educationLevel =
      _experience.educationLevel || experience.educationLevel;
    experience.fieldOfStudy =
      _experience.fieldOfStudy || experience.fieldOfStudy;
    experience.statedDate = _experience.statedDate || experience.statedDate;
    experience.endDate = _experience.endDate || experience.endDate;
    await experience.save();

    return res.status(201).json({
      message: "experience updated.",
      success: true,
      educationalBackground,
    });
  }
);

/* Deleting the educational background of the user. */
// router.delete("/:id", user_auth, async (req, res, next) => {
//   try {
//     let x = await userPreviousExperience.deleteOne({
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
