module.exports = (app) => {
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;
    console.log("==================== Job Service Received Event============");
    res.status(200).json(payload);
  });
};
