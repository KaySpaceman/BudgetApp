import express from 'express';
import { getOutgoingByDate, getOutgoingByCategory } from '../services/database/repository.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  Promise.all([getOutgoingByDate(), getOutgoingByCategory()])
    .then((result) => {
      res.render('charts', {
        monthlySpending: result[0],
        categorizedSpending: result[1],
      });
    });
});

export default router;
