import saveTransactions from '../database/repository.mjs';
import saveStatementFile from '../utility/files.mjs';
import parseTransactionData from '../parser/parser.mjs';

export default async function processStatementUpload(data, bank) {
  const path = await saveStatementFile(data);
  const transactions = await parseTransactionData(path, bank);

  return await saveTransactions(transactions)
    .catch((reason) => {
      throw new Error(`Couldn't save transactions: ${reason}`);
    });
}
