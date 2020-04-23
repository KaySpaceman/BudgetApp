import express from 'express';
import { format } from 'url';
import processStatementUpload from '../services/processor/statement-upload.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Budget App' });
});

router.get('/upload', (req, res) => {
  res.render('upload-screen', { title: 'Statement Upload' });
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
  res.render('transactions', { title: `Transaction List ${req.query.count}` });
});

export default router;
