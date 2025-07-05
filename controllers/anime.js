const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');

// Status display mapping
const statusDisplay = {
  'watching': '▶ Watching',
  'completed': '✓ Completed',
  'on-hold': '⏸ On Hold',
  'dropped': '✗ Dropped',
  'plan-to-watch': '⌛ Plan to Watch'
};

// GET all anime entries
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new Error('User not found');

    const statusFilter = req.query.status;
    let animeList = user.animeList || [];
    
    if (statusFilter) {
      animeList = animeList.filter(anime => anime.status === statusFilter);
    }

    res.render('anime/index', {
      user,
      animeList,
      statusDisplay,
      currentStatus: statusFilter
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// GET new anime form
router.get('/new', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('anime/new', {
      user,
      statusOptions: Object.keys(statusDisplay).map(key => ({
        value: key,
        label: statusDisplay[key]
      }))
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// POST create new anime
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    const newAnime = {
      title: req.body.title,
      episodes: Number(req.body.episodes),
      episodesWatched: Number(req.body.episodesWatched),
      status: req.body.status,
      score: req.body.score ? Number(req.body.score) : null,
      review: req.body.review,
      favorite: req.body.favorite === 'on'
    };

    user.animeList.push(newAnime);
    await user.save();
    res.redirect(`/users/${user._id}/anime`);
  } catch (error) {
    console.error(error);
    res.redirect(`/users/${req.params.userId}/anime/new`);
  }
});

// GET single anime
router.get('/:animeId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const anime = user.animeList.id(req.params.animeId);
    
    res.render('anime/show', {
      user,
      anime,
      statusText: statusDisplay[anime.status]
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// GET edit form
router.get('/:animeId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const anime = user.animeList.id(req.params.animeId);
    
    res.render('anime/edit', {
      user,
      anime,
      statusOptions: Object.keys(statusDisplay).map(key => ({
        value: key,
        label: statusDisplay[key],
        selected: anime.status === key
      }))
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// PUT update anime
router.put('/:animeId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const anime = user.animeList.id(req.params.animeId);
    
    anime.set({
      title: req.body.title,
      episodes: Number(req.body.episodes),
      episodesWatched: Number(req.body.episodesWatched),
      status: req.body.status,
      score: req.body.score ? Number(req.body.score) : null,
      review: req.body.review,
      favorite: req.body.favorite === 'on'
    });
    
    await user.save();
    res.redirect(`/users/${user._id}/anime/${anime._id}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/users/${req.params.userId}/anime/${req.params.animeId}/edit`);
  }
});

// DELETE anime
router.delete('/:animeId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.animeList.id(req.params.animeId).deleteOne();
    await user.save();
    res.redirect(`/users/${user._id}/anime`);
  } catch (error) {
    console.error(error);
    res.redirect(`/users/${req.params.userId}/anime/${req.params.animeId}`);
  }
});

module.exports = router;



