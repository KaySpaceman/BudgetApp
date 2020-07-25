import express from 'express';
import { createBank, getBankSelectOptions } from '../services/database/repositories/bank.mjs';
import {
  getAccounts,
  calculateAccountTotals,
  createAccount,
  editAccount,
} from '../services/database/repositories/account.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
  const [rawAccounts, availableBanks, accountTotals] = await Promise.all(
    [getAccounts(), getBankSelectOptions(), calculateAccountTotals()],
  );
  const accounts = rawAccounts.map((x) => {
    x = x.toJSON();
    x.Total = accountTotals[x._id];

    return x;
  });

  res.renderVue('Accounts.vue', {
    accounts,
    availableBanks,
  }, {
    head: {
      title: 'Account List',
    },
  });
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

router.post('/bank/new', async (req, res) => {
  const savedBank = await createBank(req.body);

  if (savedBank) {
    res.send(savedBank.toJSON());
  } else {
    res.status(500)
      .send('Unknown error');
  }
});

export default router;
