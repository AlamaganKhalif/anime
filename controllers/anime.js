const express = require("express");
const router = express.Router({ mergeParams: true });

const User = require("../models/user");
const Anime = require("../models/anime");

const statusDisplay = {
  watching: "▶ Watching",
  completed: "✓ Completed",
  "on-hold": "⏸ On Hold",
  dropped: "✗ Dropped",
  "plan-to-watch": "⌛ Plan to Watch",
};

const getStatusTagClass = (status) => {
  switch (status) {
    case "watching": return "is-link";
    case "completed": return "is-success";
    case "on-hold": return "is-warning";
    case "dropped": return "is-danger";
    case "plan-to-watch": return "is-info";
    default: return "";
  }
};

// GET all anime for user
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const statusFilter = req.query.status;
    const query = { user: user._id };
    if (statusFilter) query.status = statusFilter;

    const animeList = await Anime.find(query);
    res.render("anime/index", {
      user,
      animeList,
      statusDisplay,
      currentStatus: statusFilter,
      getStatusTagClass,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// New anime form
router.get("/new", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.render("anime/new", {
    user,
    statusDisplay,
    statusOptions: Object.keys(statusDisplay).map(key => ({
      value: key,
      label: statusDisplay[key]
    }))
  });
});

// Create anime
router.post("/", async (req, res) => {
  try {
    await Anime.create({
      title: req.body.title,
      episodes: Number(req.body.episodes),
      episodesWatched: Number(req.body.episodesWatched),
      status: req.body.status,
      score: req.body.score ? Number(req.body.score) : null,
      review: req.body.review,
      favorite: req.body.favorite === "on",
      user: req.params.userId,
    });
    res.redirect(`/users/${req.params.userId}/anime`);
  } catch (err) {
    console.error(err);
    res.redirect(`/users/${req.params.userId}/anime/new`);
  }
});

// Show single anime
router.get("/:animeId", async (req, res) => {
  try {
    const anime = await Anime.findOne({
      _id: req.params.animeId,
      user: req.params.userId,
    });
    const user = await User.findById(req.params.userId);
    res.render("anime/show", {
      user,
      anime,
      statusText: statusDisplay[anime.status],
      statusDisplay,
      getStatusTagClass 
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Edit form
router.get("/:animeId/edit", async (req, res) => {
  const anime = await Anime.findOne({
    _id: req.params.animeId,
    user: req.params.userId,
  });
  const user = await User.findById(req.params.userId);
  res.render("anime/edit", {
    user,
    anime,
    statusDisplay, 
    statusOptions: Object.keys(statusDisplay).map(key => ({
      value: key,
      label: statusDisplay[key],
      selected: anime.status === key
    }))
  });
});

// Update anime
router.put("/:animeId", async (req, res) => {
  try {
    await Anime.findOneAndUpdate(
      { _id: req.params.animeId, user: req.params.userId },
      {
        title: req.body.title,
        episodes: Number(req.body.episodes),
        episodesWatched: Number(req.body.episodesWatched),
        status: req.body.status,
        score: req.body.score ? Number(req.body.score) : null,
        review: req.body.review,
        favorite: req.body.favorite === "on",
      }
    );
    res.redirect(`/users/${req.params.userId}/anime/${req.params.animeId}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/users/${req.params.userId}/anime/${req.params.animeId}/edit`);
  }
});

// Delete anime
router.delete("/:animeId", async (req, res) => {
  try {
    await Anime.findOneAndDelete({
      _id: req.params.animeId,
      user: req.params.userId,
    });
    res.redirect(`/users/${req.params.userId}/anime`);
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

module.exports = router;





