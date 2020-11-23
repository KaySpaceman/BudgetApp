import express from 'express';
import multer from 'multer';
import { upsertTransactions } from '../services/database/repositories/transaction.mjs';
import parseTransactionData from '../services/parser/parser.mjs';

const router = express.Router();
const formParser = multer({ dest: 'tmp/' });

router.post('/', formParser.single('statementFile'), async (req, res) => {
  const { path } = req.file;
  const { account } = req.body;

  if (!path || !account) res.status(500).send('Invalid request');

  const transactions = await parseTransactionData(path, account);

  try {
    const result = await upsertTransactions(transactions);

    res.status(200).json({ newCount: result });
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

export default router;
