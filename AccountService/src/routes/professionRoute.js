const router = require("express").Router();
const userProfession = require("../models/userDetails/Profession");
const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  change_password,
  addProfession,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

// router.get("/", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
//   return res.json(await userProfession.find({ user: req.user._id }));
// });

router.get("/:id", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
  try {
    const profession = await userProfession.findById({
      _id: req.params.id,
    });
    res.status(200).json(profession);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post(
  "/profession",
  user_auth,
  /* This is a route that is used to get the profile of the user. */
  role_auth([roles.EMPLOYEE]),
  async (req, res) => {
    const id = req.user.id;
    try {
      let profession = new userProfession({
        ...req.body,
      });
      await addProfession(id, profession.id);
      let save_profession = await profession.save();
      return res.status(201).json({
        message: "profession Created Successfully.",
        success: true,
        profession: save_profession,
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
    let profession = await userProfession.findById(req.params.id);
    let _profession = req.body;
    profession.professionName =
      _profession.professionName || profession.professionName;
    profession.tag = _profession.tag || profession.tag;
    await profession.save();

    return res.status(201).json({
      message: "profession updated.",
      success: true,
      profession,
    });
  }
);

/* Deleting the educational background of the user. */
// router.delete("/:id", user_auth, async (req, res, next) => {
//   try {
//     let x = await userProfession.deleteOne({
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
