const router = require("express").Router();
// const { user_auth } = require("../middleWares/auth");
const Conversation = require("../models/chat/conversation");

/* Creating a new conversation between two users. */
router.post("/create", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const saveConversation = await newConversation.save();
    res.status(200).json(saveConversation);
  } catch (err) {
    res.status(500).json({
      message: "server error",
      err: err,
    });
  }
});

/* Finding all the conversations that the user is a member of. */
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: req.params.userId },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({
      message: "server error",
      err: err,
    });
  }
});
/* Finding a conversation between two users. */
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
