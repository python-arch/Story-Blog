const express = require("express");
const Router = express.Router();
const Story = require("../models/Story");
const { ensureAuth } = require("../middleware/auth");

// @desc  Show add page
// @route GET /stories/add

Router.route("/add").get(ensureAuth, (req, res) => {
  res.status(200).render("stories/add");
});

// @desc  Process add Form
// @route POST /stories

Router.route("/").post(ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @desc  Show all stories
// @route GET /stories/add

Router.route("/").get(ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", { stories });
  } catch (error) {
    console.error(error);
    res.render("errors/505");
  }
});

// @desc  Show single story
// @route GET /stories/:id

Router.route("/:id").get(ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      res.render("error/404");
    }

    res.render("stories/show", {
      story,
    });
  } catch (error) {
    console.error(error);
    res.render("error/404");
  }
});

// @desc  Show edit page
// @route GET /stories/edit/:id

Router.route("/edit/:id").get(ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render("errors/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story,
      });
    }
  } catch (error) {
    console.error(error);
    return res.render("errors/505");
  }
});

// @desc  Update story
// @route PUT /stories/:id

Router.route("/:id").put(ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("errors/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (error) {
    console.error(error);
    res.redirect("errors/505");
  }
});

// @desc  Delete story
// @route DELETE /stories/:id

Router.route("/:id").delete(ensureAuth, async (req, res) => {
  try {
    await Story.findByIdAndRemove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("errors/505");
  }
});

// @desc  User stories
// @route GET /stories/user/:userId

Router.route("/user/:userId").get(ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.error(error);
    res.render("errors/500");
  }
});

module.exports = Router;
