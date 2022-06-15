const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

module.exports.ValidateSignature = async (req) => {
  const signature = req.get("Authorization");

  // console.log(signature);

  if (signature) {
    const payload = await jwt.verify(signature.split(" ")[1], SECRET);
    req.user = payload;
    return true;
  }

  return false;
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
