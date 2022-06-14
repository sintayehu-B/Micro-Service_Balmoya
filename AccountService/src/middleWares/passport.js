// const UserCompany = require("../models/EmployerModel/UserCompany");
const User = require("../models/userModel/UserModel");
// const UserProfessional = require("../models/EmployeeModel/UserProfessional");
const UserAdmin = require("../models/AdminModel/UserAdmin");
const { SECRET } = require("../config/index");
const { Strategy, ExtractJwt } = require("passport-jwt");

/* Setting the options for the passport strategy. */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

/**
 * It checks if the user is in the User collection or the UserAdmin collection and returns the user if
 * found.
 * @param id - the id of the user
 * @returns The user object is being returned.
 */
async function Check_users(id) {
  let user;
  user = await User.findById(id);
  if (user) {
    return user;
  }
  user = await UserAdmin.findById(id);
  if (user) {
    return user;
  }
  return null;
}

module.exports = (passport) => {
  passport.use(
    new Strategy(options, async (payload, done) => {
      await Check_users(payload.user_id)
        .then(async (user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => {
          console.log(err);
          done(null, false);
        });
    })
  );
};
