import express from 'express';
import {
  getCategoryTree,
  getTransactions,
  saveTransactions,
} from '../services/database/repository.mjs';
import updateCategories from '../services/processor/transaction.mjs';
import { flattenCategories } from '../services/utility/formatter.mjs';
import { getAccountSelectOptions } from '../services/database/repositories/account.mjs';
import { isTransactionValid } from '../services/utility/validator.mjs';
import generateHash from '../services/utility/checksum.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
  const [transactions, categoryTree, availableAccounts] = await Promise.all(
    [getTransactions(), getCategoryTree(), getAccountSelectOptions()],
  );

  res.renderVue('Transactions.vue', {
    newCount: req.query.count,
    transactions,
    flatCategories: flattenCategories(categoryTree),
    availableAccounts,
  }, {
    head: {
      title: 'Transaction List',
      styles: [
        { style: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css' },
      ],
      scripts: [
        { src: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js' },
      ],
    },
  });
});

router.post('/categorize', async (req, res) => {
  await updateCategories(req.body);

  res.redirect('/transactions');
});

router.post('/new', async (req, res) => {
  const transaction = req.body;

  if (!transaction) {
    res.status(500)
      .send('No date received');

    return;
  }

  const category = transaction.Category || undefined;

  delete transaction.Category;
  transaction.Date = new Date(transaction.Date);
  transaction.Hash = generateHash(transaction);
  transaction.Category = category;

  if (!isTransactionValid(transaction)) {
    res.status(500)
      .send('Invalid transaction data');

    return;
  }

  try {
    const savedTransaction = await saveTransactions(transaction);

    if (!savedTransaction) {
      res.status(500)
        .send('Failed to save transaction');

      return;
    }

    res.send(transaction);
  } catch (e) {
    res.status(500)
      .send(e.toString());
  }
});

export default router;
