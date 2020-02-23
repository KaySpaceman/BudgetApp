var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Budget App' });
});

router.get('/upload', function(req, res, next) {
  res.sendFile('upload-screen.html', { title: 'Statement Upload', root: 'public' });
});

module.exports = router;
