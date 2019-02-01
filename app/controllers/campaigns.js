const express = require('express');
const config = require('../../config/config');

const { images, campaigns } = require('./utils/data')
const emitter = require('./utils/event')

const router = express.Router();
const mongoose = require('mongoose');

const Campaign = mongoose.model('Campaign');

module.exports = (app) => {
  app.use('/campaign', router);
};

router.get('/add', (req, res) => {
  const screenshots = Object.values(images)
  if (!req.user) {return res.redirect('/admin/login')}
  return res.render('campaigns', {
    year: new Date().getFullYear(),
    title: config.app.title,
    screenshots
  });
})

router.get('/:campaignid/edit', (req, res) => {
  if (!req.user) return res.redirect('/admin/login')
  const { campaignid } = req.params
  const campaign = campaigns[campaignid]
  return res.render('campaigns', {
    year: new Date().getFullYear(),
    campaign,
    screenshots: Object.values(images),
    title: config.app.title
  })
})

router.get('/:campaignid', (req, res) => {
  const { campaignid } = req.params
  const campaign = campaigns[campaignid]
  if (req.accepts('html')) { return res.redirect('back') }
  if (campaign === null) { return res.status(404).json({status: 404, message: 'Not found'})}
  return res.status(200).json({status: 200, campaign})
})


router.use((req, res, next) => {
  if (!req.user) return res.redirect('/admin/login')
  next()
})

router.put('/:campaignid', (req, res) => {
  const { campaignid } = req.params
  Campaign.findByIdAndUpdate(campaignid, req.body, {new: true, upsert: true}).then(campaign => {
    emitter.emit('campaignChanged', campaignid)
    res.status(200).json({status: 200, message: "OK"})
  }).catch(err => {
    console.error(err)
    res.status(500).json({status: 500, message: "Internal Server Error"})
  })
})

router.delete('/:campaignid', (req, res) => {
  const { campaignid } = req.params
  Campaign.findByIdAndRemove(campaignid).then(response => {
    emitter.emit('campaignDeleted', campaignid)
    res.status(200).json({status: 200, message: "OK"})
  }).catch(err => {
    console.error(err)
    res.status(500).json({status: 500, message: "Internal Server Error"})
  })
})

router.post('/', (req, res) => {
  Campaign.create(req.body).then(campaign => {
    emitter.emit('campaignChanged', campaign._id)
    res.status(201).json({status: 201, message: 'Created'})
  }).catch(err => {
    console.error(err)
    res.status(500).json({status: 500, message: "Internal Server Errror"})
  })
});
