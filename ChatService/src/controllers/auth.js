const Conversation = require("../models/chat/conversation");
const Message = require("../models/chat/message");

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
  // addPreviousExperience,
};
