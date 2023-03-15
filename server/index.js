const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');
const port = process.env.PORT || 3000;
const api = require('../config.js');

app.use(express.static(path.join(__dirname, '../client/dist')))

app.get('/product', (req, res, next) => {
  let options = {
    'url': api.URL,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options).then((data) => {
    console.log(data.data);
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
});

app.get('/styles', (req, res, next) => {
  let options = {
    'url': api.URL + '/styles',
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }

  };

  axios.request(options)
  .then((styleData) => {
    console.log(styleData.data);
    res.send(styleData.data.results);
  })
  .catch((err) => {
    res.sendStatus(400, err)
  })
});

app.listen(port, () => {
  console.log(`Listening on ${port}`)
});