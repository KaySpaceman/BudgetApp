let express = require('express');
let router = express.Router();
let uploadService = require('../services/upload-service');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Budget App' });
});

router.get('/upload', function(req, res, next) {
  res.sendFile('upload-screen.html', { title: 'Statement Upload', root: 'public' });
});

router.post('/upload-action', function(req, res, next) {
  new UploadService().processStatementUpload(req.files);

  res.sendFile('upload-screen.html', { title: 'Statement Upload', root: 'public' });
});

module.exports = router;
