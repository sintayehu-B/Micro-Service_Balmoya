// Load Express
const express = require("express");
const app = express();
// cors
const cors = require("cors");
// body parser to post json data in to database
const bodyParser = require("body-parser");
// Load Mongoose
const mongoose = require("mongoose");

const helmet = require("helmet");
const passport = require("passport");

// dotenv

const { DB_URI } = require("./src/config");

const userEducationalBackgroundRoute = require("./src/routes/educationalBackgroundRoute");
const userReferenceRoute = require("./src/routes/referenceRoute");
const userPreviousEducationRoute = require("./src/routes/previousEducationRoute");
const userProfessionRoute = require("./src/routes/professionRoute");
const user = require("./src/routes/users");
const admin = require("./src/routes/admin");
const reviews = require("./src/routes/reviews");
const report = require("./src/routes/reports");
const verifyRequest = require("./src/routes/verifyRequest");
const reportResponse = require("./src/routes/reportResponse");
const resumeBuilder = require("./src/routes/resumeBuilder");
const securityQuestion = require("./src/routes/securityQuestion");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(passport.initialize());
// app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

mongoose
  .connect(DB_URI)
  .then(console.log(" Database is up and running"))
  .catch((err) => console.log(err));

require("./src/middleWares/passport")(passport);

const { Event } = require("./src/routes/app-event");

Event(app);

app.use("/admin", admin);
app.use("/users", user);

app.use("/employee/previousExperience", userPreviousEducationRoute);
app.use("/users/reviews", reviews);
app.use("/users/verifyRequest", verifyRequest);
app.use("/employee/reports", report);
app.use("/employee/response", reportResponse);
app.use("/employee/educationalBackground", userEducationalBackgroundRoute);
app.use("/employee/reference", userReferenceRoute);
app.use("/employee/profession", userProfessionRoute);
app.use("/employee/resumeBuilder", resumeBuilder);
app.use("/employee/securityQuestion", securityQuestion);

app.listen(5655, () => {
  console.log("Account Service is up and running!");
});
