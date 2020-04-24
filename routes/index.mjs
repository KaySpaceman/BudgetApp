import express from 'express';
import { format } from 'url';
import processStatementUpload from '../services/processor/statement-upload.mjs';
import { getTransactions, getCategories } from '../services/database/repository.mjs';

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
  Promise.all([getTransactions(), getCategories()])
    .then((result) => {
      res.render('transactions', {
        count: req.query.count,
        items: result[0],
        categories: result[1],
      });
    });
});

export default router;
