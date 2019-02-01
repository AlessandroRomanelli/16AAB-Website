const express = require('express');
const config = require('../../config/config');

const router = express.Router();

const { news, images, campaigns } = require('./utils/data');


module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  const articles = Object.values(news)
  const screenshots = Object.values(images)
  articles.sort((a,b) => {
    return b.timestamp - a.timestamp
  })
  console.log(campaigns)
  res.render('index', {
    year: new Date().getFullYear(),
    title: config.app.title,
    articles,
    screenshots,
    campaigns: Object.values(campaigns)
  });
});
