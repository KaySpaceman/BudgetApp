import { upsertTransactions } from '../database/repositories/transaction.mjs';
import saveStatementFile from '../utility/files.mjs';
import parseTransactionData from '../parser/parser.mjs';

export default async function processStatementUpload(data, account) {
  const path = await saveStatementFile(data);
  const transactions = await parseTransactionData(path, account);

  return upsertTransactions(transactions)
    .catch((reason) => {
      throw new Error(`Couldn't save transactions: ${reason}`);
    });
}
