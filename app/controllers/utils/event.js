const EventEmitter = require('events')
const data = require('./data')

const mongoose = require('mongoose')
const Image = mongoose.model('Image');
const Article = mongoose.model('Article');
const Campaign = mongoose.model('Campaign');

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();

emitter.on('imageChanged', (imageId) => {
  console.log("Image "+imageId+" has changed")
  Image.findById(imageId).then(image => {
    data.images[imageId] = image
  })
})

emitter.on('imageDeleted', (imageId) => {
  console.log("Image "+imageId+" has been deleted")
  delete data.images[imageId]
})

emitter.on('articleChanged', (articleId) => {
  console.log("Article "+articleId+" has changed")
  Article.findById(articleId).populate('author').then(article => {
    data.news[articleId] = article
  })
})

emitter.on('articleDeleted', (articleId) => {
  console.log("Article "+articleId+" has been deleted")
  delete data.news[articleId]
})

emitter.on('campaignChanged', (campaignId) => {
  console.log("Campaign "+campaignId+" has changed")
  Campaign.findById(campaignId).populate('image').populate('screenshots').then(campaign => {
    data.campaigns[campaignId] = campaign
  })
})

emitter.on('campaignDeleted', (campaignId) => {
  console.log("Campaign "+campaignId+" has been deleted")
  delete data.campaigns[campaignId]
})

module.exports = emitter
