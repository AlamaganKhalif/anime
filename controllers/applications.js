const express = require('express');
const router = express.Router({ mergeParams: true }); // Access userId from parent route
const User = require('../models/user');

// ✅ GET all anime for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new Error('User not found');

    res.render('anime/index.ejs', {
      animeList: currentUser.anime || [],
      user: currentUser,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// ✅ GET form to add new anime
router.get('/new', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('anime/new.ejs', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// ✅ POST create new anime
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.anime.push(req.body);
    await user.save();
    res.redirect(`/users/${user._id}/anime`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// ✅ SHOW a single anime
router.get('/:animeId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const anime = user.anime.id(req.params.animeId);
    res.render('anime/show.ejs', { anime });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// ✅ EDIT form
router.get('/:animeId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const anime = user.anime.id(req.params.animeId);
    res.render('anime/edit.ejs', { anime, user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// ✅ PUT/UPDATE anime
router.put('/:animeId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const anime = user.anime.id(req.params.animeId);
    anime.set(req.body);
    await user.save();
    res.redirect(`/users/${user._id}/anime/${anime._id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// ✅ DELETE anime
router.delete('/:animeId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.anime.id(req.params.animeId).deleteOne();
    await user.save();
    res.redirect(`/users/${user._id}/anime`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;




