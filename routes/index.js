const express = require("express");
const Router = express.Router();
const Story = require("../models/Story");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
// @desc  Login/landing page
// @route GET

Router.route("/").get(ensureGuest, (req, res) => {
  res.status(200).render("login", {
    layout: "login",
  });
});

// @desc  Dashboard/page after login
// @route GET

Router.route("/dashboard").get(ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();

    res.status(200).render("dashboard", { name: req.user.firstName, stories });
  } catch (error) {
    console.error(error);
    res.render("errors/500");
  }
});

module.exports = Router;
