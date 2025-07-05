// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

// Middleware and Controllers
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const authController = require('./controllers/auth.js');
const animeController = require('./controllers/anime.js');

// App Initialization
const app = express();
const PORT = process.env.PORT || 3040;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
});

// Middleware Setup
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static('public'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Pass session user to all views
app.use(passUserToView);

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Routes

// Homepage
// index.js or app.js
app.get('/', async (req, res) => {
    if (req.session.user) {
      // Show the homepage WITH user info (dashboard section)
      res.render('index.ejs', { user: req.session.user });
    } else {
      // Show the guest homepage
      res.render('index.ejs', { user: null });
    }
  });
  
  
  

// Auth routes
app.use('/auth', authController);

// Protect routes below this point
app.use(isSignedIn);

// Anime routes (user-specific)
app.use('/users/:userId/anime', animeController);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
