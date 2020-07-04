import express from 'express';
import { createBank } from '../services/database/repositories/bank.mjs';

const router = express.Router();

router.post('/bank/new', async (req, res) => {
  const savedBank = await createBank(req.body);

  if (savedBank) {
    res.send(savedBank);
  } else {
    res.status(500).send('Fail');
  }
});

export default router;
