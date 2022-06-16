const router = require("express").Router();
const securityQuestion = require("../models/security_Question/Security");

/* Importing the functions from the Company.js file. */
const {
  user_auth,
  role_auth,
  checkSecurityQuestion,
  addSecurityQuestionToUser,
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
    /* The above code is creating a security question for a user. */
    try {
      let question = new securityQuestion({
        ...req.body,
        user: req.user.id,
      });
      await addSecurityQuestionToUser({
        user_id: req.user.id,
        questionId: question.id,
      });
      let save_question = await question.save();
      return res.status(201).json({
        message: "security_Question is Created Successfully.",
        success: true,
        question: save_question,
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
/**
 *  id is the securityQuestion ID
 *
 * */
router.patch(
  "/update/:id",
  user_auth,
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  async (req, res) => {
    /* This is a route that is used to update the security question of the user. */
    try {
      id = req.params.id;
      const question = await securityQuestion.findById(id).exec();
      const _question = req.body;
      if (question) {
        user_id = req.user.id;
        const user = await UserModel.findById(user_id)
          .populate("securityQuestion")
          .exec();
        /* Destructuring the securityQuestion property from the user._doc object. */
        const { securityQuestion } = user._doc;
        if (securityQuestion.id === question.id) {
          question.favoritePlace =
            _question.favoritePlace || question.favoritePlace;
          question.childhoodMemory =
            _question.childhoodMemory || question.childhoodMemory;
          question.favoriteFood =
            _question.favoriteFood || question.favoriteFood;
          await question.save();
        } else {
          res.status(404).json({ message: "no Found", success: false });
        }
      }
      return res.status(201).json({
        message: "security Question updated.",
        success: true,
        question: question,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server Error",
        success: false,
      });
    }
  }
);

// router.put("/forgot-Password", async (req, res, next) => {
//   return await forgotPassword({
//     isFullName: req.body.fullName,
//     isEmail: req.body.email,
//     new_password: req.body.new_password,
//     res: res,
//   });
// });
router.patch("/forgot-Password", async (req, res, next) => {
  return await checkSecurityQuestion({
    _question: req.body,
    isFullName: req.body.fullName,
    isEmail: req.body.email,
    isPhoneNumber: req.body.phoneNumber,
    new_password: req.body.new_password,
    res: res,
  });
});

// router.get("/forgot-password/securityQuestion", async (req, res) => {
//   try {
//     // const user = await User.findById(req.body.user).populate().exec();
//     // const { password, ...others } = user._doc;
//     // res.status(200).json({ others: others, success: true });
//   } catch (err) {
//     res.status(404).json("no user is found", err);
//   }
// });

// router.delete("/:id", user_auth, async (req, res, next) => {
//   try {
//     let x = await Reviews.deleteOne({ _id: req.user._id });
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
