import express from 'express';
import { createBank } from '../services/database/repositories/bank.mjs';

const router = express.Router();

router.post('/new', async (req, res) => {
  const savedBank = await createBank(req.body);

  if (savedBank) {
    res.send(savedBank.toJSON());
  } else {
    res.status(500)
      .send('Unknown error');
  }
});

export default router;
