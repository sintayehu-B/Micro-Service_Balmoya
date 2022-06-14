const router = require("express").Router();
// const { user_auth } = require("../middleWares/auth");
const Message = require("../models/chat/message");

/* Creating a new message. */
router.post("/create", async (req, res) => {
  // const sender = req.user.id
  const newMessage = new Message({
    ...req.body,
  });
  try {
    const saveMessage = await newMessage.save();
    res.status(200).json(saveMessage);
  } catch (err) {
    res.status(500).json({
      message: "server error",
      err: err,
    });
  }
});

/* A get request to the server. */
router.get("/conversationId/:id", async (req, res) => {
  try {
    const message = await Message.find({
      conversation: req.params.id,
    }).exec();
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({
      message: "server error",
      err: err,
    });
  }
});
module.exports = router;
