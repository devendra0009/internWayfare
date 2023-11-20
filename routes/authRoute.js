const express = require('express');
const passport = require('passport');
const router = express.Router();

router
  .get('/login', (req, res) => {
    res.render('login');
  })
  .get('/register', (req, res) => {
    res.render('register');
  })
  .get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile'], // what do we want from user's google
    })
  )
  .get('/google/redirect', passport.authenticate('google'), (req, res) => {
      res.redirect('/user/profile');
  })
  .get('/logout', (req, res) => {
    // handle using passport
    req.logout(); 
    res.redirect('/')
  });

module.exports = router;
