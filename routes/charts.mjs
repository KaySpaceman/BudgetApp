import express from 'express';
import { getOutgoingByDate, getOutgoingByCategory } from '../services/database/repository.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
  const [monthlySpending, categorizedSpending] = await Promise.all(
    [getOutgoingByDate(), getOutgoingByCategory()],
  );

  res.renderVue('Charts.vue', {
    monthlySpending,
    categorizedSpending,
  }, {
    head: {
      title: 'Spending Charts',
      styles: [
        { style: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css' },
      ],
      scripts: [
        { src: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js' },
        { src: 'https://d3js.org/d3.v5.min.js' },
      ],
    },
  });
});

router.post('/data/categorized', async (req, res) => {
  const data = await getOutgoingByCategory(req.body.timeInterval);

  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

export default router;
