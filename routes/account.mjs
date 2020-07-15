import express from 'express';
import { createBank } from '../services/database/repositories/bank.mjs';
import { createAccount } from '../services/database/repositories/account.mjs';

const router = express.Router();

router.post('/new', async (req, res) => {
  try {
    const savedAccount = await createAccount(req.body);

    if (savedAccount) {
      res.send(savedAccount);
    } else {
      res.status(500)
        .send('Unknown error');
    }
  } catch (e) {
    res.status(500)
      .send(e.toString());
  }
});

router.post('/bank/new', async (req, res) => {
  const savedBank = await createBank(req.body);

  if (savedBank) {
    res.send(savedBank);
  } else {
    res.status(500)
      .send('Unknown error');
  }
});

export default router;
