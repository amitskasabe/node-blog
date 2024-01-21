const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Blogs").then(() => {
  console.log("Connected to MongoDB");
}).catch("could not connect to db");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// User route
app.use("/user", userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
