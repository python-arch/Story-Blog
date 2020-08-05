const express = require("express");
const Router = express.Router();
const passport = require("passport");
// @desc  Auth with google
// @route GET /auth/google

Router.route("/google").get(
  passport.authenticate("google", { scope: ["profile"] })
);

// @desc  Google auth callback
// @route GET /auth/google/callback

Router.route("/google/callback").get(
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc Logout user
// @route /auth/logout

Router.route("/logout").get((req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = Router;
