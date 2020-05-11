import express from 'express';
import { getOutgoingByDate, getOutgoingByCategory } from '../services/database/repository.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  Promise.all([getOutgoingByDate(), getOutgoingByCategory()])
    .then(([monthlySpending, categorizedSpending]) => {
      res.renderVue('Charts.vue', {
        monthlySpending,
        categorizedSpending,
      }, {});
    });
});

export default router;
