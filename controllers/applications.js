const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const { model } = require('mongoose');

router.get('/', async (req , res) => {
    try {
        const userId = req.params.userId;
        const currentUser = await User.findById(userId);
        if (!currentUser) throw new Error('User not found');

        res.render('applications/index.ejs', {
            application: currentUser.application || [],
            user: currentUser
        })
    } catch (error) {
        console.log(error);
        res.redirect('./')
    }
});

module.exports = router;