const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  episodes: Number,
  episodesWatched: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'],
  },
  score: {
    type: Number,
    min: 1,
    max: 10,
  },
  review: String,
  favorite: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

