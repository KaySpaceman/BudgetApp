import connectDb from './database-provider.mjs';
import saveStatementFile from './file-service.mjs';
import parseTransactionData from './parsers/citadele.mjs';

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
