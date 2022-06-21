const { createServer } = require("http"); // you can use https as well
const express = require("express");
const socketIo = require("socket.io");

const app = express();
const server = createServer(app);
const io = socketIo(server, { cors: { origin: "*" } }); // you can change the cors to your own domain

app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Now all routes & middleware will have access to req.io

app.use("/api", require("./routes/api")); // this file's express.Router() will have the req.io too.

server.listen(3000, () => console.log(`Server started!`));
