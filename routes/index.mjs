import express from 'express';
import { format } from 'url';
import processStatementUpload from '../services/processor/statement.mjs';
import { getBankSelectOptions } from '../services/database/repositories/bank.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  res.renderVue('Index.vue', {}, {
    head: {
      title: 'Budget App',
    },
  });
});

router.get('/upload', async (req, res) => {
  const availableBanks = await getBankSelectOptions();

  res.renderVue('StatementUpload.vue', {
    availableBanks,
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

router.post('/upload-action', (req, res) => {
  processStatementUpload(req.files, req.body.bank)
    .then((count) => {
      res.redirect(format({
        pathname: '/transactions',
        query: {
          count,
        },
      }));
    })
    .catch((reason) => {
      res.redirect(format({
        pathname: '/transactions',
        query: {
          error: reason,
        },
      }));
    });
});

export default router;
