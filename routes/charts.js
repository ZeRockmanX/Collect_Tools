var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/chart-1', function (req, res, next) {
  // res.render('index', { title: 'Express' });

  MongoClient.connect('mongodb://localhost:27017').then((client) => {
    let dateMap = {};
    client.db('spider_rakuten').collection('Article_1727').find().forEach((doc) => {
      if (dateMap[doc.reviewDate]) {
        dateMap[doc.reviewDate] += 1;
      } else {
        dateMap[doc.reviewDate] = 1;
      }
    }, (error) => {
      let items = [];
      for(let d in dateMap) {
        items.push({
          x: d,
          y: dateMap[d]
        });
      }
      res.render('chart-1', { items: items });
    });
  });

});

module.exports = router;
