import express from 'express';
import {
  getAccounts,
  calculateAccountTotals,
  createAccount,
  editAccount,
} from '../services/database/repositories/account.mjs';

const router = express.Router();

router.get('/all', async (req, res) => {
  const allAccounts = await getAccounts();

  res.setHeader('Content-Type', 'application/json');
  res.send(allAccounts.map((acc) => acc.toJSON()));
});

router.get('/totals', async (req, res) => {
  const totals = await calculateAccountTotals();

  res.setHeader('Content-Type', 'application/json');
  res.send(totals);
});

router.post('/new-edit', async (req, res) => {
  try {
    const account = req.body._id ? await editAccount(req.body) : await createAccount(req.body);

    if (account) {
      res.send(account.toJSON());
    } else {
      res.status(500)
        .send('Unknown error');
    }
  } catch (e) {
    res.status(500)
      .send(e.toString());
  }
});

export default router;
