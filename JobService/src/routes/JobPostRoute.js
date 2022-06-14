const router = require("express").Router(),
  JobPost = require("../models/Job/JobPost"),
  user_auth = require("../controllers/auth"),
  roles = require("../controllers/roles"),
  { PublishCustomerEvent } = require("../controllers/index"),
  {
    role_auth,
    addJobPostToUser,
    RemoveJobPostFromUser,
  } = require("../controllers/jobPostController");

router.patch(
  "/:id",
  user_auth,
  role_auth([roles.EMPLOYER]),
  async (req, res) => {
    try {
      const post = await JobPost.findById(req.params.id);

      if (post) {
        try {
          const updatedPost = await JobPost.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can only update your post !");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
// Create Post

/* This is a post request to create a new post. */
// the id params is the the logged-in user
router.post(
  "/create",
  user_auth,
  role_auth([roles.EMPLOYER]),
  async (req, res) => {
    try {
      // const id = req.params.id;
      const newPost = new JobPost({
        ...req.body,
        postedBy: req.body.postedBy,
      });
      const user_Id = req.body.postedBy;
      /* Adding the job post to the user. */
      const savedPost = await newPost.save();
      const jobPosted = savedPost.id;
      const { data } = await addJobPostToUser(
        user_Id,
        jobPosted,
        "add_JobPost_To_User"
      );
      PublishCustomerEvent(data);
      // console.log(savedPost.employee);
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        err: err,
      });
    }
  }
);

// Delete Post

/* Deleting the post. */

router.delete(
  "/:id",
  user_auth,
  role_auth([roles.EMPLOYER, roles.ADMIN]),
  async (req, res) => {
    try {
      const post = await JobPost.findById(req.params.id).exec();
      if (post) {
        try {
          const postId = req.params.id;
          const { postedBy } = post._doc;
          const { data } = await RemoveJobPostFromUser(
            { user_id: postedBy.toString(), jobsPosted_id: postId },
            "Remove_JobPost_from_user"
          );
          await PublishCustomerEvent(data);
          await post.delete();
          res.status(200).json("Post deleted successfully");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("unauthorize to delete this  post !");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// Get Post
/* This is a get request to get a single post. */
router.get("/:id", async (req, res) => {
  try {
    const post = await JobPost.findById(req.params.id)
      .populate("jopAppliedUsers")
      .exec();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/postedBy/:id", async (req, res) => {
  try {
    const post = await JobPost.findById(req.params.id)
      .populate("jopAppliedUsers")
      .exec();

    // const { postedBy } = post._doc;
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all posts
/* This is a get request to get all the posts. */
router.get("/", user_auth, async (req, res) => {
  const companyName = req.query.company;
  const tag = req.query.tag;
  const jobType = req.query.jobType;
  const location = req.query.location;
  const salary = req.query.salary;
  // add location
  try {
    let posts;
    if (companyName) {
      posts = await JobPost.find({ companyName });
    } else if (tag) {
      posts = await JobPost.find({
        tag: {
          $in: [tag],
        },
      });
    } else if (jobType) {
      posts = await JobPost.find({
        jobType,
      });
    } else if (location) {
      posts = await JobPost.find({
        location,
      });
    } else if (salary) {
      posts = await JobPost.find({
        salary,
      });
    } else {
      posts = await JobPost.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const post = await JobApplied.find().populate("jobPost").exec();
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json({ message: "server error", err, err });
//   }
// });

module.exports = router;
