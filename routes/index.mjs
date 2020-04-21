import express from 'express';
import processStatementUpload from '../services/processor/statement-upload.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Budget App' });
});

router.get('/upload', (req, res) => {
  res.sendFile('upload-screen.html', { title: 'Statement Upload', root: 'public' });
});

router.post('/upload-action', (req, res) => {
  processStatementUpload(req.files);

  res.sendFile('upload-screen.html', { title: 'Statement Upload', root: 'public' });
});

export default router;
