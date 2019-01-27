const express = require('express');
const config = require('../../config/config');

const router = express.Router();
const mongoose = require('mongoose');

const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  Article.find({}).populate('author').then(articles => {
    articles.sort((a,b) => {
      return b.timestamp - a.timestamp
    })
    res.render('index', {
      year: new Date().getFullYear(),
      title: config.app.title,
      articles
    });
  })
});
