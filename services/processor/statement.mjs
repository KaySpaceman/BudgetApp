import saveTransactions from '../database/repository.mjs';
import saveStatementFile from '../utility/files.mjs';
import parseTransactionData from '../parser/parser.mjs';

export default async function processStatementUpload(data, bank) {
  const path = await saveStatementFile(data);
  const transaction = await parseTransactionData(path, bank);

  return saveTransactions(transaction)
    .then((count) => count)
    .catch((reason) => {
      throw new Error(`Couldn't save transactions: ${reason}`);
    });
}
