const express = require('express');
const app = express();
const compression = require('compression');
const path = require('path')
const axios = require('axios');
require('dotenv').config();
const api = require('../config.js');
const multer = require('multer');
const fs = require('fs');
const questionsRoute = require('./routes/Questions.js');
const answersRoute = require('./routes/Answers.js');
const storeImage = require('./lib/storeImage.js');

app.use(compression());
app.use(express.static(path.join(__dirname, '../client/dist')))
app.use(express.json());

// Set up multer to handle file uploads
// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../client/dist/images'));
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    cb(null, `${originalName}`);
  }
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, '../client/dist')));


app.post('/uploadReviewPic', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileName = file.originalname;

  const filePath = path.join(__dirname, `../client/dist/images/${fileName}`)

  // Redirect to the storeReviewPic route with fileName as a query parameter
  res.redirect(`/storeReviewPic?filePath=${filePath}`);
});

app.get('/storeReviewPic', (req, res) => {
  const filePath = req.query.filePath;

  // Add image to cloudinary api
  storeImage(filePath, (file) => {
    res.send('' + file.url);
  });

})

app.post('/addReview', (req, res, next) => {


  console.log(JSON.stringify(req.body));
  let options = {
    'url': api.REVIEWSURL,
    'method': 'post',
    'maxBodyLength': Infinity,
    'maxContentLength': Infinity,
    'headers': {
      'Authorization': api.TOKEN,
      'Content-Type': 'application/json'
    },
    'data': req.body
  }

  axios.request(options).then((data) => {
    res.sendStatus(202);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(405);
  })
});

app.get('/product', (req, res, next) => {
  let options = {
    'url': req.query ? api.URL + req.query['product_id'] : api.testURL,
    'params': req.query,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }
  //console.log(options);
  axios.request(options).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    //console.log(err);
    res.sendStatus(404);
  })
});
//stylez API request*******
app.get('/styles', (req, res, next) => {
  console.log(req.query.product_id)
  let options = {
    'url': req.query ? api.URL + req.query['product_id'] + '/styles' : api.testURL + '/styles',
    'params': req.query,
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

//Questions & Answers routes
app.use('/questions', questionsRoute);
app.use('/answer', answersRoute);


app.get('/reviews', (req, res, next) => {
  let options = {
    'url': api.REVIEWSURL,
    'params': req.query,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
});

app.get('/reviewsMeta', (req, res, next) => {
  console.log(req.query);
  let options = {
    'url': api.REVIEWSURL + 'meta',
    'params': req.query,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
});

app.get('/related', (req, res, next) => {
  let options = {
    //TODO: change this back when api.URL no longer hardcoded
    'url': req.query ? api.URL + req.query['product_id'] + '/related' : api.testURL + '/related',
    // 'url': api.URL + req.query['product_id'] + '/related',
    // 'url': api.URL + req.query['product_id'] + '/related': api.testURL,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options).then((data) => {
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
});

app.put('/reviewsHelpful', (req, res, next) => {
  let options = {
    'url': api.REVIEWSURL + req.query['reviewID'] + '/helpful',
    'method': 'put',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options)
    .then((data) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })
})

app.put('/reviewsReport', (req, res, next) => {
  let options = {
    'url': api.REVIEWSURL + req.query['reviewID'] + '/report',
    'method': 'put',
    'headers': {
      'Authorization': api.TOKEN
    }
  }

  axios.request(options)
    .then((data) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })
})

app.post('/deleteImages', (req, res, next) => {
  const directory = path.join(__dirname, '../client/dist/images');
  fs.readdir(directory, (err, files) => {
    if (err) {
      res.sendStatus(405);
    };

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) {
          res.sendStatus(405);
        }
      });
    }
  });
  res.sendStatus(202);
})

app.get('/cart', (req, res) => {

  let options = {
    'url': 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/cart',
    // 'url': api.URL,
    // 'params': req.query,
    'method': 'get',
    'headers': {
      'Authorization': api.TOKEN
    }
  }
  console.log(options);
  axios.request(options).then((data) => {
    // console.log(data.data);
    res.send(data.data);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })

})

app.post('/clickTrack', (req, res, next) => {
  console.log(req.query);
  let options = {
    'url': api.INTURL,
    'method': 'post',
    'headers': {
      'Authorization': api.TOKEN
    },
    'data': {
      'widget': req.query.widget,
      'element': req.query.element,
      'time': JSON.stringify(Date.now())
    }
  }

  axios.request(options).then((data) => {
    // console.log(data.data);
    res.sendStatus(201);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(404);
  })
})

app.post('/cart', (req, res) => {
  let options = {
    'url': 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/cart',
    'method': 'post',
    'headers': {
      'Authorization': api.TOKEN
    },
    'data': {
      'sku_id': req.query.sku_id
    }
  }

  axios.request(options).then((data) => {
     console.log('********************');
    res.sendStatus(201);
  }).catch((err) => {
    console.log('**********', err);
    res.sendStatus(404);
  })

})

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on ${port}`)
});