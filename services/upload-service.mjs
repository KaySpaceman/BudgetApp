import csv from 'csv-parser';
import fs from 'fs';
import connectDb from './database-provider.mjs';
import saveStatementFile from './file-service.mjs';

// TODO: Move parsing to new service
function extractTransactionData(path) {
  let statementRows = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv({ separator: '|' }, ['Name', 'Age']))
      .on('error', (err) => {
        reject(err);
      })
      .on('data', (row) => {
        statementRows.push({
          Date: row[0],
          Type: row[1],
          Note: row[2],
          No: row[3],
          Ref: row[4],
          Amount: row[5],
          Bank: 'Citadele',
        });
      })
      .on('end', () => {
        statementRows.splice(0, 3)
          .splice(statementRows.length - 5, statementRows.length);

        resolve(statementRows);
      });
  });
}

export default function processStatementUpload(data) {
  saveStatementFile(data)
    .then((path) => {
      const rowPromise = extractTransactionData(path);

      rowPromise.then((rows) => {
        let rowCount = 0;

        if (!rows || rows.length === 0) return false;

        // TODO: Move DB operations to new service
        connectDb().then((db) => {
          db.collection(process.env.MONGO_COL_TRANSACTIONS)
            .insertMany(rows)
            .then(() => {
              rowCount = rows.length;
              console.log(`Imported ${rowCount} transactions to the DB`);

              return rowCount;
            })
            .catch((reason) => {
              console.log(`Failed to import transactions: ${reason}`);
            });
        });
      });
    });
}
