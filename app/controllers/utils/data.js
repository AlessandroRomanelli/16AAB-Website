const mongoose = require('mongoose');

const Article = mongoose.model('Article');
const Image = mongoose.model('Image');
const Campaign = mongoose.model('Campaign');

const data = {
  news: {},
  images: {},
  campaigns: {}
}

Article.find({}).populate('author').then(news => {
  news.forEach(article => {
    data.news[article._id] = article
  })
});

Image.find({}).then(images => {
  images.forEach(image => {
    data.images[image._id] = image
  })
})

Campaign.find({}).populate('image').populate('screenshots').then(campaigns => {
  campaigns.forEach(campaign => {
    data.campaigns[campaign._id] = campaign
  })
})

module.exports = data
