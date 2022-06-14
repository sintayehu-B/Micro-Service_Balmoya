const User = require("../models/userModel/UserModel");
const bcrypt = require("bcrypt");
// const moment = require("moment");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { SECRET } = require("../config");
const moment = require("moment");
const PreviousExperience = require("../models/userDetails/PreviousExperience");

const verifyRequest = require("../models/userDetails/verifyRequest");
const { addVerifyRequiresToAdmin } = require("../controllers/admin_auth");
const axios = require("axios");

/**
 * Register Users
 *
 */
/**
 * It creates a new user in the database
 * @param user_dets - { user details}
 * @param role - "professional"
 * @param res - is the response object
 * @returns a promise.
 */

const user_register = async (user_dets, role, res) => {
  try {
    // //Validate username
    let username_not_taken = await validate_username(user_dets.fullName);
    if (!username_not_taken) {
      return res.status(400).json({
        message: "Username already taken.",
        success: false,
      });
    }
    //Validate email
    let email_not_taken = await validate_email(user_dets.email);
    if (!email_not_taken) {
      return res.status(400).json({
        message: "email already taken.",
        success: false,
      });
    }

    // if (user_dets.profilePicture == null || user_dets.profilePicture == "") {
    //   return res.status(400).json({
    //     message: "Enter profile picture",
    //     success: false,
    //   });
    // }
    const password = await bcrypt.hash(user_dets.password, 12);

    //Create the User
    const new_user = new User({
      ...user_dets,
      role,
      password,
      profilePicture: user_dets.profilePicture,
    });
    // if (req.file) {
    //   new_user.profilePicture = req.file.path;
    // }
    let resp = await new_user.save();
    return res.status(201).json({
      message: "Registration successful.",
      success: true,
      user: serialize_user(resp),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: `unable to create your account`,
      success: false,
    });
    // TODO Logging with winston
  }
};
/**
 * Login Users
 */
/**
 * It checks if the user exists in the database, if it does, it checks if the password matches, if it
 * does, it creates a token and sends it back to the user
 * @param user_creds - {user cred}
 * @param res - response object
 * @returns The user object is being returned.
 */
const user_login = async (user_creds, res) => {
  let { fullName, password, email } = user_creds;
  // Check username or email
  const user = await User.findOne({
    $or: [{ fullName: fullName }, { email: email }],
  });

  if (!user) {
    return res.status(404).json({
      message: `There is not an account with this email or username`,
      success: false,
    });
  }
  let password_match = await bcrypt.compare(password, user.password);

  if (password_match) {
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
      SECRET,
      { expiresIn: "15 days" }
    );
    let result = {
      id: user._id,
      fullName: user.fullName,
      // role: user.role,
      email: user.email,
      token: `${token}`,
      expiryDate: moment().add(200, "hours"),
    };
    return res.status(200).json({
      ...result,
      message: `login successful`,
      success: true,
    });
  } else {
    return res.status(403).json({
      message: `Invalid credentials!`,
      success: false,
    });
  }
};
/**
 * If a user is found with the same fullName, return false, otherwise return true.
 * @param fullName - The full name of the user
 * @returns A function that takes a fullName as an argument and returns a boolean.
 */
const validate_username = async (fullName) => {
  let user = await User.findOne({ fullName });
  return user ? false : true;
};
/**
 * If a user is found with the email provided, return false, otherwise return true.
 * @param email - The email address to validate
 * @returns A boolean value.
 */
const validate_email = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};
/**
 * Passport middleware
 */
/* A middleware that checks if the user is authenticated. */
const user_auth = passport.authenticate("jwt", { session: false });

/**
 *  Update User middleware
 */

/**
 * It updates a user's record in the database.
 * </code>
 * @param id - The id of the user you want to update
 * @param _user - The user object that is sent from the frontend
 * @param res - The response object
 * @returns a promise.
 */

const update_user = async (id, _user, res) => {
  try {
    let user = await User.findById(id);
    //Validate username
    let username_not_taken = await validate_username(_user.name);
    if (!username_not_taken && user._id === id) {
      return res.status(400).json({
        message: "Username already taken.",
        success: false,
      });
    }
    //Validate email
    let email_not_taken = await validate_email(_user.email);
    if (!email_not_taken && user._id === id) {
      return res.status(400).json({
        message: "email already taken.",
        success: false,
      });
    }
    if (_user.profilePicture == null || _user.profilePicture == "") {
      return res.status(400).json({
        message: "Enter profile picture",
        success: false,
      });
    }

    user.role = _user.role || user.role;
    user.email = _user.email || user.email;
    user.fullName = _user.fullName || user.fullName;
    user.description = _user.description || user.description;
    user.phoneNumber = _user.phoneNumber || user.phoneNumber;
    user.location = _user.location || user.location;
    user.profilePicture = _user.profilePicture || user.profilePicture;

    //...Add the rest like this
    await user.save();
    return res.status(200).json({
      message: `Records updated successfully.`,
      success: true,
      user: user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: `unable to update your account`,
      success: false,
    });
    // TODO Logging with winston
  }
};

/**
 * Change Password
 */
/**
 * It takes in a user id, old password, new password and a response object. It then checks if the old
 * password matches the one in the database. If it does, it updates the password with the new one
 * @param id - The id of the user
 * @param old_password - The password that the user is currently using
 * @param new_password - "12345678"
 * @param res - response object
 * @returns a promise.
 */
const change_password = async (id, old_password, new_password, res) => {
  // TODO Check password strength
  try {
    const user = await User.findById(id);
    let password_match = await bcrypt.compare(old_password, user.password);
    if (!password_match && new_password) {
      //TODO Change this later on password strength check
      return res.status(403).json({
        message: `Incorrect Password.`,
        success: false,
      });
    } else {
      user.password = await bcrypt.hash(new_password, 12);
      await user.save();
      return res.status(200).json({
        message: `Password updated successfully.`,
        success: true,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: `unable to change your password.`,
      success: false,
    });
    // TODO Logging with winston
  }
};

/**
 * Check role middleware
 */
/**
 * If the user's role is included in the roles array, then return next() else return a 401 error.
 * @param roles - An array of roles that are allowed to access the route.
 * @returns A function that takes 3 arguments.
 */
const role_auth = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({
    message: `Forbidden.`,
    success: false,
  });
};
/**
 * It checks if the user is active or not. If the user is active, it returns the next() function. If
 * the user is not active, it returns a 403 error
 * @param user - The user object that is returned from the database.
 * @returns a function.
 */
const check_for_banned_user = (user) => (req, res, next) => {
  if (user._isUserActive === false) {
    return res.status(403).json({
      message: `This user is forbidden for  login in or FORBIDDEN.`,
      success: false,
    });
  }
  next();
};

/**
 * It takes a user_id and an educational_id and adds the educational_id to the user's
 * educationalBackgrounds array.
 * @param user_id - the id of the user
 * @param educational_id - 5e8f8f8f8f8f8f8f8f8f8f8f
 * @returns The updated user object.
 */
const addEducationalBackground = async (user_id, educationalBackground) => {
  return await User.findByIdAndUpdate(
    user_id,
    {
      $push: { educationalBackground: educationalBackground },
    },
    { new: true }
  ).exec();
};

/**
 * This function takes a user_id and a PreviousExperience_id and adds the PreviousExperience_id to the
 * user's previousExperience array.
 * @param user_id - the id of the user
 * @param PreviousExperience_id - 5e8f8f8f8f8f8f8f8f8f8f8f
 * @returns The user object with the new previousExperience array.
 */
const addPreviousExperience = async (user_id, PreviousExperience_id) => {
  return await User.findByIdAndUpdate(
    user_id,
    {
      $push: { previousExperience: PreviousExperience_id },
    },
    { new: true }
  ).exec();
};
/**
 * It takes a user_id and a reviews_id and adds the reviews_id to the user's reviews array.
 * @param user_id - the id of the user
 * @param reviews_id - the id of the review that was just created
 * @returns The updated user object.
 */
const addReviewsToUser = async (user_id, reviews_id) => {
  return await User.findByIdAndUpdate(
    user_id,
    {
      $push: { reviews: reviews_id },
    },
    { new: true }
  ).exec();
};
/**
 * It takes a user_id and a profession_id and adds the profession_id to the user's profession array.
 * @param user_id - the id of the user you want to add the profession to
 * @param profession_id - 5e8f8f8f8f8f8f8f8f8f8f8f
 * @returns A promise that resolves to the updated user document.
 */
const addProfession = async (user_id, profession_id) => {
  return await User.findByIdAndUpdate(
    user_id,
    {
      $push: { profession: profession_id },
    },
    { new: true }
  ).exec();
};
/**
 * It takes a previousExperience_id and a referenceId and adds the referenceId to the
 * previousExperience_id's referenceId array.
 * @param previousExperience_id - the id of the previousExperience document
 * @param referenceId - {
 * @returns The updated previousExperience document.
 */
const addReference = async (user_id, referenceId) => {
  return await User.findByIdAndUpdate(
    user_id,
    {
      $push: { referenceId: referenceId },
    },
    { new: true }
  ).exec();
};

/**
 * It takes in a user_id and a jobPosted_id and adds the jobPosted_id to the user's jobsPosted array.
 * @returns The updated user object.
 */
const addJobPostToUser = async ({ user_id, jobPosted_id }) => {
  const x = await User.findByIdAndUpdate(
    user_id,
    {
      $push: { jobsPosted: jobPosted_id },
    },
    { new: true }
  ).exec();
  return x;
};

/**
 * It removes a jobPostId from a user's jobsPosted array.
 * </code>
 * @returns The user object with the updated jobsPosted array.
 */
const RemoveJobPostIdFromUser = async ({ user_id, jobPosted_id }) => {
  const user = await User.findById(user_id).exec();
  // const currentUser = await User.findById(req.body.userId);
  if (user.jobsPosted.includes(jobPosted_id)) {
    const x = await User.findByIdAndUpdate(user_id, {
      $pull: { jobsPosted: { $in: [jobPosted_id] } },
    }).exec();
    // await currentUser.updateOne({ $pull: { followings: req.params.id } });
    // await user.save()
    return x;
  } else {
    return false;
  }
};
/**
 * It takes a payload, and depending on the event, it will call a function with the data from the
 * payload.
 * @param payload - {
 */
const SubscribeEvent = (payload) => {
  const { event, data } = payload;
  const { user_id, jobsPosted_id } = data;

  switch (event) {
    case "add_JobPost_To_User":
      /* Adding a job to a user. */
      addJobPostToUser({ user_id, jobPosted_id: jobsPosted_id });
      break;
    case "Remove_JobPost_from_user":
      RemoveJobPostIdFromUser({ user_id, jobPosted_id: jobsPosted_id });
      break;
    // case "add_ApplyForJob_To_User":
    //   addApplyForJobToUser(job_id, jobApplied);
    //   break;
    case "test":
      console.log("working");
      break;
  }
};
/**
 * It takes a user_id and a resume_id and adds the resume_id to the resumeBuilder array of the user
 * with the user_id.
 * @param user_id - the id of the user
 * @param resume_id - the id of the resume that was just created
 * @returns The updated user object.
 */

const addResumeToUser = async (user_id, resume_id) => {
  return await User.findByIdAndUpdate(
    user_id,
    {
      $push: { resumeBuilder: resume_id },
    },
    { new: true }
  ).exec();
};
/**
 * Find the user by their id and update the user's report_Id array by pushing the report_Id into it.
 * @param user_id - the id of the user you want to add the report to
 * @param report_Id - is the name of the field in the User model
 * @returns The updated user object.
 */
const addReportToUser = async (reporter_id, report_Id) => {
  return await User.findByIdAndUpdate(
    reporter_id,
    {
      $push: { report_Id: report_Id },
    },
    { new: true }
  ).exec();
};

/**
 * It's a function that takes a user object and a response object as parameters and returns a response
 * object.
 * </code>
 * @param _user - {
 * @param res - response
 * @returns {
 *     "message": "verify Request has been send successfully.",
 *     "success": true,
 *     "verify": {
 *         "id": "5f0f8f8f8f8f8f8f8f8f8f8f",
 *         "user": {
 *             "id": "5f0f8f
 */
const get_verified = async (id, _user, res) => {
  // let { user } = _user;
  // const get_id = await getID();
  // console.log(get_id);
  try {
    const customer = await User.findById(id).exec();
    if (customer) {
      if (customer.verified === false) {
        const verify = new verifyRequest({
          ..._user,
          user: id,
        });
        await addVerifyRequiresToAdmin(verify.id);
        await verify.save();
        return res.status(200).json({
          message: `verify Request has been send successfully.`,
          success: true,
          verify: verify,
        });
      } else if (customer.verified === true) {
        res.status(204).json({
          message: "Can not send this message because it verified already",
          success: false,
          customer: customer,
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      message: "Bad request",
      success: false,
      err: err,
    });
  }
};

/**
 * It takes a user_id and a report_id and adds the report_id to the user's report array.
 * @param user_id - the id of the user that is the admin
 * @param report_id - the id of the report that was just created
 * @returns The updated user object.
 */
// const addReportToAdmin = (user_id, report_id) => {
//   return UserAdmin.findByIdAndUpdate(
//     user_id,
//     {
//       $push: { report: report_id },
//     },
//     { new: true }
//   );
// };

/**
 * It takes a user object and returns a new object with only the properties we want to expose to the
 * client
 * @param user - The user object that you want to serialize.
 * @returns The user object is being returned.
 */
const serialize_user = (user) => {
  return {
    role: user.role,
    verified: user.verified,
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    _isUserActive: user._isUserActive,
  };
};

module.exports = {
  update_user,
  change_password,
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  check_for_banned_user,
  addEducationalBackground,
  addPreviousExperience,
  addProfession,
  addReference,
  addResumeToUser,
  addReportToUser,
  get_verified,
  addReviewsToUser,
  RemoveJobPostIdFromUser,
  addJobPostToUser,
  SubscribeEvent,
};
