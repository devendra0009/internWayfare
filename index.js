const express = require('express');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const passportSetup = require('./config/passportSetup');
const mongoose = require('mongoose');
const path = require('path');
const cookieSession = require('cookie-session');
const passport = require('passport');

// db connection

mongoose
  .connect('mongodb://localhost:27017/wayfare')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// app intialize

const app = express();

// body parser for express
app.use(express.json({ limit: '50mb' }));

// redirection for images hosted using server
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// for ejs
app.set('view engine', 'ejs');

// setting cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['mysecretkey'],
  })
);

// initializing passport
app.use(passport.initialize());
app.use(passport.session());

// routes for auth and user
app.use('/auth', authRoute);
app.use('/user', userRoute);

app.get('/', (req, res) => {
  res.render('index', { data: req.user });
});

app.listen(8000, (req, res) => {
  console.log('app running');
});
