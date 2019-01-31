const mongoose = require('mongoose');

const Article = mongoose.model('Article');
const Image = mongoose.model('Image');

const data = {
  news: {},
  images: {}
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

module.exports = data
