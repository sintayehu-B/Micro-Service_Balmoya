const router = require("express").Router();
const userReference = require("../models/userDetails/References");
const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  change_password,
  addReference,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

/* This is a get request to the route /reference/:id. */
router.get("/:id", user_auth, role_auth([roles.EMPLOYEE]), async (req, res) => {
  try {
    const reference = await userReference.findById({
      _id: req.params.id,
    });
    res.status(200).json(reference);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* This is a post request to the route /reference. */
router.post(
  "/reference",
  user_auth,
  role_auth([roles.EMPLOYEE]),
  async (req, res) => {
    try {
      let reference = new userReference({
        ...req.body,
        user: req.user.id,
      });
      await addReference(req.user.id, reference.id);
      let save_reference = await reference.save();
      return res.status(201).json({
        message: "reference Created Successfully.",
        success: true,
        reference: save_reference,
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

/* This is a patch request to the route /reference/:id. */
router.patch(
  "/:id",
  user_auth,
  role_auth([roles.EMPLOYEE]),
  async (req, res) => {
    let reference = await userReference.findById(req.params.id);
    let _reference = req.body;
    reference.fullName = _reference.fullName || reference.fullName;
    reference.position = _reference.position || reference.position;
    reference.email = _reference.email || reference.email;
    reference.phoneNumber = _reference.phoneNumber || reference.phoneNumber;
    await reference.save();

    return res.status(201).json({
      message: "reference updated.",
      success: true,
      reference,
    });
  }
);

/* Deleting the educational background of the user. */
// router.delete("/:id", user_auth, async (req, res, next) => {
//   try {
//     let x = await userReference.deleteOne({
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
