import connectDb from '../database/connector.mjs';
import saveStatementFile from '../utility/file-manager.mjs';
import parseTransactionData from '../parser/citadele.mjs';

export default function processStatementUpload(data) {
  saveStatementFile(data)
    .then((path) => {
      parseTransactionData(path)
        .then((rows) => {
          let rowCount = 0;

          if (!rows || rows.length === 0) return false;

          // TODO: Move DB operations to new service
          connectDb()
            .then((db) => {
              db.collection(process.env.MONGO_COL_TRANSACTIONS)
                .insertMany(rows)
                .then(() => {
                  rowCount = rows.length;
                  console.log(`Imported ${rowCount} transactions to the DB`);

                  return rowCount;
                })
                .catch((reason) => {
                  console.log(`Failed to import transactions: ${reason}`);

                  return false;
                });
            });
        });
    });
}
