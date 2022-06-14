// const User = require("../models/userModel/UserModel");
const bcrypt = require("bcrypt");
// const moment = require("moment");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { SECRET } = require("../config");
const moment = require("moment");
// const PreviousExperience = require("../models/userDetails/PreviousExperience");
// const UserAdmin = require("../models/AdminModel/UserAdmin");
// const { addVerifyRequiresToAdmin} = require("../controllers/admin_auth");
// const verifyRequest = require("../models/userDetails/verifyRequest");
// const { addVerifyRequiresToAdmin } = require("../controllers/admin_auth");
const JobPost = require("../models/Job/JobPost");
const { FormateData } = require("../utils/");

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
 * "addApplyForJobToJobPost" is a function that takes in an object with two properties, "job_id" and
 * "jobApplied_id", and returns a promise that resolves to a jobpost with the jobApplied_id added to
 * the jobpost's jopAppliedUsers array.
 * </code>
 * @returns The updated jobpost
 */
const addApplyForJobToJobPost = async ({ job_id, jobApplied_id }) => {
  const jobpost = await JobPost.findById(job_id).exec();
  return await JobPost.findByIdAndUpdate(
    job_id,
    {
      $push: { jopAppliedUsers: jobApplied_id },
    },
    { new: true }
  ).exec();
};

/**
 * This function takes in a user_id, a jobsPosted_id, and an event, and returns a payload if the
 * jobPost is found, or an error if it is not.
 * @param user_id - the id of the user
 * @param event - the event name
 * @returns The payload is being returned.
 */
const addJobPostToUser = async (user_id, jobsPosted_id, event) => {
  const jobPost = await JobPost.findById(jobsPosted_id).exec();
  if (jobPost) {
    const payload = {
      event: event,
      data: { user_id, jobsPosted_id },
    };
    return FormateData(payload);
  } else {
    return Error("server error");
  }
};
/**
 * It takes in a user_id, a jobsPosted_id, and an event, and returns a payload object with the user_id,
 * jobsPosted_id, and event.
 * </code>
 * @param user_id - the id of the user
 * @param jobsPosted_id - the id of the job post
 * @param event - the event name
 * @returns a promise.
 */
const RemoveJobPostFromUser = async ({ user_id, jobsPosted_id }, event) => {
  const jobPost = await JobPost.findById(jobsPosted_id).exec();
  if (jobPost) {
    const payload = {
      event: event,
      data: { user_id, jobsPosted_id },
    };
    return FormateData(payload);
  } else {
    return Error("server error");
  }
};

module.exports = {
  role_auth,
  addApplyForJobToJobPost,
  addJobPostToUser,
  RemoveJobPostFromUser,
};
