const router = require("express").Router();
const verify = require("../models/userDetails/verifyRequest");

/* Importing the functions from the Company.js file. */
const {
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  update_user,
  change_password,
  get_verified,
} = require("../controllers/auth");
/* Importing the roles from the roles.js file. */
const roles = require("../controllers/roles");

router.post(
  "/get-verified",
  user_auth,
  role_auth([roles.EMPLOYEE, roles.EMPLOYER]),
  async (req, res) => {
    return await get_verified(req.user.id, req.body, res);
  }
);

module.exports = router;
