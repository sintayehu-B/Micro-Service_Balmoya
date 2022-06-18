const router = require("express").Router();
user_auth = require("../controllers/auth");
const roles = require("../controllers/roles");
const {
  role_auth,
  addApplyForJobToJobPost,
} = require("../controllers/jobPostController");
const JobApplied = require("../models/job/JobApplied");

/* This is a post request to apply for a job. */
router.post(
  "/create/:id",
  user_auth,
  role_auth([roles.EMPLOYEE]),
  async (req, res) => {
    try {
      const newPost = new JobApplied({
        ...req.body,
        applyUser: req.body.applyUser,
        jobPost: req.params.id,
      });
      await addApplyForJobToJobPost({
        job_id: req.params.id,
        jobApplied_id: newPost.id,
      });
      const savedApply = await newPost.save();

      res.status(200).json(savedApply);
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        err: err,
      });
    }
  }
);

// Delete Post

/* This is a delete request to delete a single post. */
//   router.delete("/:id", user_auth, role_auth([roles.EMPLOYER]), async (req, res) => {
//     try {
//       const post = await JobPost.findById(req.params.id);

//       if (post.id === req.body.id) {
//         try {
//           await post.delete();
//           res.status(200).json("Post deleted successfully");
//         } catch (err) {
//           res.status(500).json(err);
//         }
//       } else {
//         res.status(401).json("You can only delete your post !");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

/* This is a get request to get a single post. */
router.get(
  "/:id",
  user_auth,
  role_auth([roles.EMPLOYER, roles.ADMIN]),
  async (req, res) => {
    try {
      const post = await JobApplied.findById(req.params.id)
        .populate("jobPost")
        .exec();
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

/* This is a get request to get all posts. */
router.get("/", user_auth, role_auth([roles.EMPLOYER]), async (req, res) => {
  try {
    const post = await JobApplied.find().populate("jobPost").exec();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "server error", err, err });
  }
});
module.exports = router;
