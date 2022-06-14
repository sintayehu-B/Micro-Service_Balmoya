const { SubscribeEvent } = require("../controllers/auth");

module.exports.Event = (app) => {
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;
    try {
      SubscribeEvent(payload);
      console.log(
        "==================== Account Service Received Event ==================="
      );
      res.status(200).json(payload);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message || "Unknown Error" });
    }
  });
};
