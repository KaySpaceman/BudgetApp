import express from 'express';
import { getOutgoingByDate } from '../services/database/repository.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  getOutgoingByDate().then((data) => {
    res.render('charts', {
      monthlySpending: data,
    });
  });
});

export default router;
