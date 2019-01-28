const express = require('express');
const config = require('../../config/config');

const router = express.Router();
const mongoose = require('mongoose');

const Article = mongoose.model('Article');
const Image = mongoose.model('Image');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  const data = {};
  Article.find({}).populate('author').then(articles => {
    articles.sort((a,b) => {
      return b.timestamp - a.timestamp
    })
    data.articles = articles
    return Image.find({})
  }).then(screenshots => {
    res.render('index', {
      year: new Date().getFullYear(),
      title: config.app.title,
      articles: data.articles,
      screenshots
    });
  })
});
