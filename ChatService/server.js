const express = require("express");
const app = express();
// body parser to post json data in to database
const bodyParser = require("body-parser");
// Load Mongoose
const mongoose = require("mongoose");
// dotenv
const { DB_URI } = require("./src/config");
// socket
const { createServer } = require("http");
const socketIo = require("socket.io");
const server = createServer(app);
const io = socketIo(server, { cors: { origin: "*" } }); // you can change the cors to your own domain

// route
const conversationRoute = require("./src/routes/conversation");
const messagesRoute = require("./src/routes/messages");

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.io = io;
  return next();
});

mongoose
  .connect(DB_URI)
  .then(console.log(" Database is up and running"))
  .catch((err) => console.log(err));

// setting the route for the book

app.use("/users/conversation", conversationRoute);
app.use("/users/message", messagesRoute);

app.listen(8002, () => {
  console.log("Chat Service is up and running!");
});
