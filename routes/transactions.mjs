import express from 'express';
import { getCategoryTree, getTransactions } from '../services/database/repository.mjs';
import updateCategories from '../services/processor/transaction.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  Promise.all([getTransactions(), getCategoryTree()])
    .then((result) => {
      res.render('transactions', {
        count: req.query.count,
        items: result[0],
        categories: result[1],
      });
    });
});

router.post('/categorize', (req, res) => {
  updateCategories(req.body)
    .then((count) => {
      res.send(String(count));
    });
});

export default router;
