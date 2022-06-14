const express = require("express");
const app = express();
const cors = require("cors");
// const bodyParser = require()
const proxy = require("express-http-proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/microservice/accountService", proxy("http://localhost:5655"));
app.use("/microservice/jobService", proxy("http://localhost:8001"));
app.use("/microservice/chatService", proxy("http://localhost:8002"));
app.listen(8000, () => {
  console.log("GateWay is Listening to port 8000");
});
