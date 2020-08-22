import express from 'express';
import { format } from 'url';
import processStatementUpload from '../services/processor/statement.mjs';
import {
  getBankDateFormatOptions,
} from '../services/database/repositories/bank.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  res.renderVue('Index.vue', {}, {
    head: {
      title: 'Budget App',
    },
  });
});

router.get('/upload', async (req, res) => {
  const [dateFormats] = await Promise.all(
    [getBankDateFormatOptions()],
  );

  res.renderVue('StatementUpload.vue', {
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
