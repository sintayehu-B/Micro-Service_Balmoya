const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const passport = require("passport");
// body parser to post json data in to database
const bodyParser = require("body-parser");

// Load Mongoose
const mongoose = require("mongoose");
// dotenv
const { DB_URI } = require("./src/config");
// route
const jobPostRoute = require("./src/routes/jobPostRoute");
const applyJobRoute = require("./src/routes/applyJobRoute");
const passport = require("passport");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(passport.se)

app.use(passport.initialize());
app.use(bodyParser.json());
// require("../AccountService/src/middleWares/passport")(passport);

mongoose
  .connect(DB_URI)
  .then(console.log(" Database is up and running"))
  .catch((err) => console.log(err));

require("./src/routes/app-event")(app);
// setting the route for the book
app.use("/employer/jobPost", jobPostRoute);
app.use("/employee/applyForJob", applyJobRoute);
app.listen(8001, () => {
  console.log("Job Service is up and running!");
});
