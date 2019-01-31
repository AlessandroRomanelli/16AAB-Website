const express = require('express');
const config = require('../../config/config');

const router = express.Router();

const { news, images } = require('./utils/data');


module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  const articles = Object.values(news)
  const screenshots = Object.values(images)
  res.render('index', {
    year: new Date().getFullYear(),
    title: config.app.title,
    articles,
    screenshots
  });
});
