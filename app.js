require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());

// routes
const auth = require("./routes/auth");
app.use("/auth", auth);

// invalid token
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  } else {
    next(err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  mongoose.connection.once("open", () => {
    console.log("database connected");
  });
  console.log(`listening on port ${port}`);
});
