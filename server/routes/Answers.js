const express = require('express');
const app = express.Router();
const axios = require('axios');
const api = require('../../config.js');
const sharp = require('sharp');

//post answer
app.post('/add', async (req, res) => {
  let photos = req.body.photos;
  let sharpImages = await Promise.all(
    photos.map(async (image) => {
      let imageBuffer = Buffer.from(image, 'base64');

      const resized = await sharp(imageBuffer)
        .resize(50, 50)
        .jpeg({quality: 1})
        .toBuffer();

        return resized.toString('base64');
    })
  );

  let options = {
    'url': api.QUESTIONS + `/${req.body.question_id}/answers`,
    // 'params': req.body.question_id,
    'method': 'post',
    'headers': {
      'Authorization': api.TOKEN
    },
    'data': {
      'body': req.body.answer,
      'name': req.body.nickname,
      'email': req.body.email,
      'photos': sharpImages
    }
  }

  try {
    console.log('OPTIONS_____________________________________,',options)
    let result = await axios.request(options);
    console.log(result);
    res.send('Working');
  } catch(err) {
    res.status(404).send(err)
  }
});

//increase helpfulness of answer
app.put('/helpful', async (req, res) => {
  console.log(req.body.answer_id);
  let options = {
    'url': api.ANSWER + `/${req.body.answer_id}/helpful`,
    'method': 'put',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  await axios.request(options);
  res.status(201).send('working');

});

//report an answer
app.put('/report', async (req, res) => {
  console.log(req.body.answer_id);
  let options = {
    'url': api.ANSWER + `/${req.body.answer_id}/report`,
    'method': 'put',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  await axios.request(options);
  res.status(201).send('working');

});


module.exports = app