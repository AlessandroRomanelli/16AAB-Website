const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const config = require('../../config/config');
const fs = require('fs')
const path = require('path')

const User = mongoose.model('User');
const Image = mongoose.model('Image');

const getExtension = (base64) => {
  let [ extension ] = base64.split(',', 1);
  [ extension ] = extension.split(';', 1);
  extension = extension.split('/')[1];
  return extension
}

const decodeBase64Image = (dataString) => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

const root = path.dirname(require.main.filename)


module.exports = (app) => {
  app.use('/screenshot', router);
};

router.get('/', (req, res, next) => {
  Image.find({}).then(images => {
    res.status(200).json({status:200, images})
  }).catch(err => next(err))
})

router.get('/add', (req, res) => {
  res.status(200).render('screenshot', { title: config.app.title, year: new Date().getFullYear() })
})

router.post('/', (req, res, next) => {
  const { title, image, description } = req.body
  const ext = getExtension(image);
  const imageBuffer = decodeBase64Image(image);
  const id = mongoose.Types.ObjectId();
  const fileName = `${id}.${ext}`
  fs.writeFile(`${root}/public/img/uploads/${fileName}`, imageBuffer.data, (err) => {
    if (err) return next(err);
    Image.create({_id: id, path: `/img/uploads/${fileName}`, title, description }).then(created => {
      res.status(201).json({status: 201, message: 'Created'})
    }).catch(err => next(err))
  })
})

router.get('/:imageid', (req, res, next) => {
  const { imageid } = req.params
  Image.findById(imageid).then(screenshot => {
    if (screenshot === null) { return res.status(404).json({status: 404, message: 'Not Found'}) }
    return res.status(200).json({status: 200, screenshot})
  })
})

router.delete('/:imageid', (req, res, next) => {
  const { imageid } = req.params
  Image.findByIdAndRemove(imageid).then(image => {
    fs.unlink(root+'/public'+image.path, (err) => {
      if (err) return next(err)
      console.log('File deleted')
      return res.status(200).json({status: 200, message: "OK"})
    })
  })
})
