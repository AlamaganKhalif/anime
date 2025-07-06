const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  episodes: Number,
  episodesWatched: { type: Number, default: 0 },
  status: {
    type: String,
    required: true,
    enum: ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch']
  },
  score: { type: Number, min: 1, max: 10 },
  review: String,
  favorite: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Anime = mongoose.model('Anime', animeSchema);
module.exports = Anime;
