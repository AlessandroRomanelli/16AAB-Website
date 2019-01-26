const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const config = require('../../config/config');

const User = mongoose.model('User');
const News = mongoose.model('Article');

module.exports = (app) => {
  app.use('/admin', router);
};


router.get('/', (req, res) => {
  if (req.user) {
    return News.find({}).populate('author').then((news) => {
      console.log(news);
      return res.render('admin', { year: new Date().getFullYear(), articles: news });
    });
  }
  return res.redirect('/admin/login');
});


router.get('/login', (req, res) => {
  res.render('login', { year: new Date().getFullYear() });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ status: 200 });
});

router.post('/signup', (req, res) => {
  const { username, password, secret } = req.body;
  if (secret !== 'mySuperSecret') { return res.status(401).json({ status: 401, message: 'Unauthorized'}) }
  return User.findOne({ username }).then((user) => {
    if (user === null) {
      return bcrypt.hash(password, config.salt).then((hash) => {
        return User.create({ username, password: hash }).then((newUser) => {
          res.status(201).json({ status: 201, newUser });
        });
      }).catch((err) => {
        console.error(err);
        res.status(500).json({ status: 500, message: err.message });
      });
    }
    return res.status(400).json({ status: 400, message: 'Username already taken' });
  });
});
