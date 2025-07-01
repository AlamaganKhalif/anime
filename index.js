const dotenv = require('dotenv');
dotenv .config();


const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan'); 
const session = require("express-session");




const app = express();

const PORT = process.env.PORT || 3040


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`)
})






app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
});