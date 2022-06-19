const Admin = require("../models/AdminModel/UserAdmin"),
  User = require("../models/userModel/UserModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const passport = require("passport");
const mongoose = require("mongoose");
const { SECRET } = require("../config");
const moment = require("moment");
const UserAdmin = require("../models/AdminModel/UserAdmin");
const verifyRequest = require("../models/userDetails/verifyRequest");
const notification = require("../models/Notification/Notification");

/**
 * It takes in the user details, role, and response object, validates the email, hashes the password,
 * creates a new user object, saves the user to the database and returns a response to the user
 * @param admin_dets - This is the object containing the user details.
 * @param role - The role of the user.
 * @param res - The response object.
 * @returns a promise.
 */

const user_register = async (admin_dets, role, res) => {
  try {
    // //Validate username
    /* Checking if the username is already taken. */
    let email_not_taken = await validate_email(admin_dets.email);
    if (!email_not_taken) {
      return res.status(400).json({
        message: "email already taken.",
        success: false,
      });
    }

    // if (admin_dets.profilePicture == null || admin_dets.profilePicture == "") {
    //   return res.status(400).json({
    //     message: "Enter profile picture",
    //     success: false,
    //   });
    // }

    /* Hashing the password. */
    const password = await bcrypt.hash(admin_dets.password, 12);

    /* Creating a new user object with the user details, role, password, description, phoneNumber and
  location. */
    const new_user = new Admin({
      ...admin_dets,
      role,
      password,
      profilePicture: admin_dets.profilePicture,
    });
    /* Saving the user to the database and returning a response to the user. */
    let resp = await new_user.save();
    return res.status(201).json({
      message: "Registration successful.",
      success: true,
      user: serialize_user(resp),
    });
  } catch (e) {
    /* A try catch block. */
    console.log(e);
    return res.status(500).json({
      message: `unable to create your account`,
      success: false,
    });
    // TODO Logging with winston
  }
};
/**
 * It checks if the user exists in the database, if it does, it checks if the password matches, if it
 * does, it returns a token.
 * </code>
 * @param admin_creds - {
 * @param res - response object
 * @returns a promise.
 */

const user_login = async (admin_creds, res) => {
  let { name, password, email } = admin_creds;
  // Check username or email
  const user = await Admin.findOne({
    $or: [{ name: name }, { email: email }],
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
        name: user.name,
        email: user.email,
      },
      SECRET,
      { expiresIn: "15 days" }
    );
    let result = {
      _id: user.id,
      name: user.name,
      role: user.role,
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
 * If a user is found, return false, otherwise return true.
 * @param name - The name of the user
 * @returns A promise that resolves to a boolean.
 */
const validate_username = async (name) => {
  let user = await Admin.findOne({ name });
  return user ? false : true;
};
/**
 * If a user is found with the email provided, return false, otherwise return true.
 * @param email - The email address to validate
 * @returns A boolean value.
 */
const validate_email = async (email) => {
  let user = await Admin.findOne({ email });
  return user ? false : true;
};
/**
 * Passport middleware
 */
/* A middleware that checks if the user is authenticated. */
const user_auth = passport.authenticate("jwt", { session: false });
// console.log(user_auth);

/**
 * It updates a user's profile.
 * @param id - The id of the user you want to update
 * @param _user - The user object that you want to update
 * @param res - The response object
 * @returns a promise.
 */

const update_user = async (id, _user, res) => {
  try {
    let user = await Admin.findById(id);
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

    user.email = _user.email || user.email;
    user.name = _user.name || user.name;
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
 * @param old_password - The current password of the user
 * @param new_password - The new password that the user wants to change to.
 * @param res - response object
 * @returns a promise.
 */
const change_password = async (id, old_password, new_password, res) => {
  // TODO Check password strength
  try {
    const user = await Admin.findById(id);
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
 * If the user's role is included in the roles array, then return next() to continue the request,
 * otherwise return a 401 error.
 * @param roles - An array of roles that are allowed to access the route.
 * @returns A function that takes in a roles array and returns a function that takes in a request,
 * response, and next function.
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
 * It takes in an id and a response object, and then it tries to find a user by that id, and if it
 * finds one, it deletes it and sends a 200 response, otherwise it sends a 404 response.
 * @param id - the id of the user to be deleted
 * @param res - the response object
 */
const delete_users = async (user_id, res) => {
  try {
    let user = await User.findById(user_id);
    if (user) {
      await User.deleteOne({ _id: user_id });
      // await user.delete();
      res.status(200).json("user removed successfully");
    } else {
      res.status(404).json("not found");
    }
  } catch (err) {
    res.status(400).json("NOT FOUND");
  }
};

/**
 * It checks if the user is active, if so, it updates the user's status to inactive, if not, it returns
 * a message saying the user is already banned.
 * @param _user - the user object that is passed in the request body
 * @param res - the response object
 * @returns The user object is being returned.
 */
const banning_users = async (_user, res) => {
  let { id } = _user;
  try {
    const user = await User.findById(id).exec();
    if (user) {
      if (user._isUserActive === true) {
        user._isUserActive = _user._isUserActive || user._isUserActive;
        await user.save();
        return res.status(200).json({
          message: `Records updated successfully.`,
          success: true,
          user: user,
        });
      } else {
        res.status(403).json({
          message: "the user is Banned already",
          success: false,
          user: user,
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      message: "Bad request",
      err: err,
    });
  }
};

/**
 * It takes in a user object and a response object, and then it finds the user by id, and if the user
 * is found, it checks if the user is banned, and if the user is banned, it un-bans the user and
 * returns a success message.
 * @param _user - {
 * @param res - response
 * @returns The user object is being returned.
 */
const unBanning_users = async (_user, res) => {
  let { id } = _user;
  try {
    const user = await User.findById(id);
    if (user) {
      if (user._isUserActive === false) {
        user._isUserActive = _user._isUserActive || user._isUserActive;
        await user.save();
        return res.status(200).json({
          message: `Records updated successfully.`,
          success: true,
          user: user,
        });
      } else {
        res.status(403).json({
          message: "the user is UnBanned already",
          success: false,
          user: user,
        });
      }
    }
    // next();
  } catch (err) {
    res.status(400).json({
      message: "Bad request",
      err: err,
    });
  }
};

/**
 * It checks if the user's verificationStatus is "Not_verified" or "pending" and if it is, it updates
 * the user's verificationStatus to "Verified" and returns a success message.
 * @param _user - {
 * @param res - is the response object
 * @returns a promise.
 */
const verifying_user_status = async (_user, res) => {
  let { id } = _user;
  try {
    const user = await User.findById(id).select(["-password"]).exec();
    if (user) {
      if (user.verified === false) {
        user.verified = _user.verified || user.verified;
        await user.save();
        return res.status(200).json({
          message: `Records updated successfully.`,
          success: true,
          user: user,
        });
      } else if (user.verified === true) {
        res.status(204).json({
          message: "the user is already Verified",
          success: false,
          user: user,
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      message: "Bad request",
      err: err,
    });
  }
};

/**
 * It checks if the user is verified, if the user is verified, it changes the user's verified status to
 * false, if the user is not verified, it returns a 204 status code.
 * </code>
 * @param _user - is the user object that is passed in the request body
 * @param res - is the response object
 * @returns a promise.
 */
const unVerify_user_status = async (_user, res) => {
  let { id } = _user;
  try {
    const user = await User.findById(id).select(["-password"]).exec();
    if (user) {
      if (user.verified === true) {
        user.verified = _user.verified || user.verified;
        await user.save();
        return res.status(200).json({
          message: `Records updated successfully.`,
          success: true,
          user: user,
        });
      } else if (user.verified === false) {
        res.status(204).json({
          message: "the user is already unVerified",
          success: false,
          user: user,
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      message: "Bad request",
      err: err,
    });
  }
};

/**
 * Find the admin by id and update the admin's reportResponse array by pushing the reportResponse_id
 * into it.
 * @param admin_id - the id of the admin
 * @param reportResponse_id - the id of the reportResponse that was just created
 * @returns The updated admin object.
 */
const addReportResponseToAdmin = async (admin_id, reportResponse_id) => {
  return await UserAdmin.findByIdAndUpdate(
    admin_id,
    {
      $push: { reportResponse: reportResponse_id },
    },
    { new: true }
  ).exec();
};

/**
 * It returns a random user ID from the database.
 * @returns The return value is a promise.
 */
const getID = async () => {
  let user;
  user = await UserAdmin.find().exec();
  // console.log(user);
  const single_user = user[Math.floor(Math.random() * user.length)];
  return serialize_admin_id(single_user);
};

/**ban
 * It takes a reports_id, gets the admin's id, and then adds the reports_id to the admin's report
 * array.
 * @param reports_id - the id of the report that is being added to the admin
 * @returns The return value is the updated document.
 */
const addReportToAdmin = async (reports_id) => {
  const get_id = await getID();
  // console.log(get_id);
  return await UserAdmin.findByIdAndUpdate(
    get_id._id,
    {
      $push: { report: reports_id },
    },
    { new: true }
  ).exec();
};

/**
 * This function takes an admin_id and a notificationID and adds the notificationID to the admin's
 * notification array.
 * @param admin_id - the id of the admin
 * @param notificationID - the id of the notification that was just created
 * @returns The updated admin object.
 */
const addNotificationToAdmin = async (admin_id, notificationID) => {
  return await UserAdmin.findByIdAndUpdate(
    admin_id,
    {
      $push: { notification: notificationID },
    },
    { new: true }
  ).exec();
};
/**
 * This function takes a user_id and a notificationID and adds the notificationID to the user's
 * notification array.
 * @param user_id - the user id of the user you want to add the notification to
 * @param notificationID - the id of the notification that was created
 * @returns The user object with the notification array updated.
 */
const add_NotificationToUser = async (user_id, notificationID) => {
  return await User.findByIdAndUpdate(
    user_id,
    {
      $push: { notification: notificationID },
    },
    { new: true }
  ).exec();
};

/**
 * It takes a user object and a response object as parameters, then it finds the user by id, if the
 * user is found, it creates a new notification object, then it adds the notification id to the user
 * and admin, then it saves the notification object, then it returns a response object with a message
 * and the notification object.
 * @param _user - {
 * @param res - is the response object
 * @returns a promise.
 */
const send_Notification_To_user = async (id, _user, res) => {
  // const user = await User.findById(user_id).exec();
  const { user } = _user;
  try {
    const userAdmin = await Admin.findById(id).exec();
    if (userAdmin) {
      const notify = new notification({
        ..._user,
        admin: id,
      });
      await addNotificationToAdmin(id, notify.id);
      await add_NotificationToUser(user, notify.id);
      await notify.save();
      return res.status(200).json({
        message: `notify Request has been send successfully.`,
        success: true,
        notify: notify,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Bad request",
      err: err,
    });
  }
};

/**
 * It takes a verifyRequestID, gets the ID of the admin, and then adds the verifyRequestID to the
 * admin's verifyRequests array.
 * @param verifyRequestID - is the id of the verifyRequest document
 * @returns The return value is the updated document.
 */
const addVerifyRequiresToAdmin = async (verifyRequestID) => {
  const get_id = await getID();
  // console.log(get_id);
  return await UserAdmin.findByIdAndUpdate(
    get_id._id,
    {
      $push: { verifyRequests: verifyRequestID },
    },
    { new: true }
  ).exec();
};

/**
 * It takes an admin object and returns a new object with only the _id property
 * @param admin - The admin object to serialize.
 * @returns The _id of the admin.
 */
function serialize_admin_id(admin) {
  return {
    _id: admin._id,
  };
}
/**
 * It takes a user object and returns a new object with only the properties that you want to expose to
 * the client.
 * @param user - The user object that is being serialized.
 * @returns The user object is being returned.
 */
function serialize_user(user) {
  return {
    role: user.role,
    verified: user.verified,
    _id: user._id,
    name: user.name,
    email: user.email,
  };
}
module.exports = {
  update_user,
  change_password,
  user_register,
  user_login,
  user_auth,
  serialize_user,
  role_auth,
  delete_users,
  banning_users,
  verifying_user_status,
  unBanning_users,
  addReportResponseToAdmin,
  getID,
  addReportToAdmin,
  unVerify_user_status,
  addVerifyRequiresToAdmin,
  send_Notification_To_user,
  add_NotificationToUser,
};
