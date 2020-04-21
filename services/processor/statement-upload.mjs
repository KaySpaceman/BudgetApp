import saveTransactions from '../database/repository.mjs';
import saveStatementFile from '../utility/file-manager.mjs';
import parseTransactionData from '../parser/citadele.mjs';

export default function processStatementUpload(data) {
  return new Promise((resolve, reject) => {
    saveStatementFile(data)
      .then((path) => {
        parseTransactionData(path)
          .then((rows) => {
            saveTransactions(rows)
              .then((count) => {
                resolve(count);
              })
              .catch((reason) => {
                reject(reason);
              });
          });
      });
  });
}
