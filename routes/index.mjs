import express from 'express';
import { format } from 'url';
import processStatementUpload from '../services/processor/statement.mjs';

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

export default router;
