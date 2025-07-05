const mongoose = require('mongoose');

// Anime subdocument schema
const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  episodesWatched: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'],
    required: true,
  },
  notes: String,
});

// User schema with embedded anime array
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  application: [animeSchema], // 👈 renamed from "applications" to "animeList"
});

const User = mongoose.model('User', userSchema);
module.exports = User;
