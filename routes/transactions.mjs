import express from 'express';
import { getCategoryTree, getTransactions } from '../services/database/repository.mjs';
import updateCategories from '../services/processor/transaction.mjs';
import { flattenCategories } from '../services/utility/formatter.mjs';
import { getAccountSelectOptions } from '../services/database/repositories/account.mjs';

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

export default router;
