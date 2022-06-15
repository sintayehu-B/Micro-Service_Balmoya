const Conversation = require("../models/chat/conversation");
const Message = require("../models/chat/message");

const role_auth = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({
    message: `Forbidden.`,
    success: false,
  });
};
const serialize_user = (user) => {
  return {
    verified: user.verified,
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    _isUserActive: user._isUserActive,
  };
};

module.exports = {
  serialize_user,
  role_auth,
  // addPreviousExperience,
};
