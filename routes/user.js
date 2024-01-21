const { Router } = require("express");
const { User } = require("../models/user");
const { renderFile } = require("ejs");
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup"); // Make sure the view name is correct
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log("Received data:", { fullName, email, password });

    const result = await User.create({
      fullName,
      email,
      password,
    });

    if (result) {
      return res.json({ status: 100, message: "yes" });
    } else {
      return res.json({ status: 500, message: "internal server error" });
    }

    return res.json({ status: 100, message: "done" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong!");
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = User.matchPassword(email, password);
  console.log("User", user);
  return res.redirect("/");
});

module.exports = router;
