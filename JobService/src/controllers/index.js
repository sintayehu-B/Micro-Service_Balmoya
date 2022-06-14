const axios = require("axios");

/* A function that is being exported. */
module.exports.PublishCustomerEvent = async (payload) => {
  try {
    await axios.post(
      "http://localhost:8000/microservice/accountService/app-events",
      {
        payload,
      }
    );
  } catch (error) {
    return Error("server error", err);
  }
};
