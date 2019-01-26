const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/news', router);
};

router.get('/add', (req, res) => {
  if (!req.user) {return res.redirect('/admin/login')}
  return res.render('news', { year: new Date().getFullYear()});
})

router.get('/:newsid/edit', (req, res) => {
  if (!req.user) return res.redirect('/admin/login')
  const { newsid } = req.params
  Article.findById(newsid).then(article => {
    return res.render('news', { year: new Date().getFullYear(), article})
  }).catch(err => {
    console.error(err)
    return res.status(500).json({status: 500, message: "Internal Server Error"})
  })
})

router.get('/:newsid', (req, res) => {
  const { newsid } = req.params
  Article.findById(newsid).populate('author').then(article => {
    if (article === null) { return res.status(404).json({status: 404, message: 'Not found'})}
    return res.status(200).json({status: 200, article})
  }).catch(err => {
    console.error(err)
    res.status(500).json({status: 500, message: "Internal Server Error"})
  })
})


router.use('/', (req, res, next) => {
  if (!req.user) return res.redirect('/admin/login')
  next()
})

router.put('/:newsid', (req, res) => {
  const {title, content, image} = req.body
  const { newsid } = req.params
  Article.findByIdAndUpdate(newsid, req.body, {upsert: true}).then(article => {
    res.status(200).json({status: 200, message: "OK"})
  }).catch(err => {
    console.error(err)
    res.status(500).json({status: 500, message: "Internal Server Error"})
  })
})

router.delete('/:newsid', (req, res) => {
  const { newsid } = req.params
  Article.findByIdAndRemove(newsid).then(response => {
    res.status(200).json({status: 200, message: "OK"})
  }).catch(err => {
    console.error(err)
    res.status(500).json({status: 500, message: "Internal Server Error"})
  })
})

router.post('/', (req, res) => {
  const {title, content, image} = req.body
  Article.create({title, author: req.user._id, content, image}).then(article => {
    res.status(201).json({status: 201, message: 'Created'})
  }).catch(err => {
    console.error(err)
    res.status(500).json({status: 500, message: "Internal Server Errror"})
  })
});
