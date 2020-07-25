import express from 'express';
import { format } from 'url';
import processStatementUpload from '../services/processor/statement.mjs';
import {
  getBankDateFormatOptions,
  getBankSelectOptions,
} from '../services/database/repositories/bank.mjs';
import { getAccountSelectOptions } from '../services/database/repositories/account.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  res.renderVue('Index.vue', {}, {
    head: {
      title: 'Budget App',
    },
  });
});

router.get('/upload', async (req, res) => {
  const [availableAccounts, availableBanks, dateFormats] = await Promise.all(
    [getAccountSelectOptions(), getBankSelectOptions(), getBankDateFormatOptions()],
  );

  res.renderVue('StatementUpload.vue', {
    availableAccounts,
    availableBanks,
    dateFormats,
  }, {
    head: {
      title: 'Bank statement upload',
      styles: [
        { style: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css' },
      ],
      scripts: [
        { src: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js' },
      ],
    },
  });
});

router.post('/upload-action', async (req, res) => {
  try {
    const count = await processStatementUpload(req.files, req.body.account)

    res.redirect(format({
      pathname: '/transactions',
      query: {
        count,
      },
    }));
  } catch (e) {
    res.redirect(format({
      pathname: '/transactions',
      query: {
        error: e.toString(),
      },
    }));
  }
});

export default router;
