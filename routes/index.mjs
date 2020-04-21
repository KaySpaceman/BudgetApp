import express from 'express';
import processStatementUpload from '../services/processor/statement-upload.mjs';
import { format } from 'url';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Budget App' });
});

router.get('/upload', (req, res) => {
  res.sendFile('upload-screen.html', {
    title: 'Statement Upload',
    root: 'public',
  });
});

router.post('/upload-action', (req, res) => {
  processStatementUpload(req.files, req.param('bank'))
    .then((count) => {
      res.redirect(format({
        pathname: '/transactions',
        query: {
          count,
        },
      }));
    })
    .catch((reason) => {
      res.redirect(format({
        pathname: '/transactions',
        query: {
          error: reason,
        },
      }));
    });
});

router.get('/transactions', (req, res) => {
  res.sendFile('transactions.html', {
    title: `Transaction List ${req.query.count}`,
    root: 'public',
  });
});

export default router;
