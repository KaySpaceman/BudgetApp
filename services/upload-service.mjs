import csv from 'csv-parser';
import fs from 'fs';
import client from './database-provider.mjs';

function saveStatementFile(data) {
  const statement = data['statement-file'].data;
  const filePath = `tmp/statement-${Date.now()}.csv`;

  if (!statement) return false;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, statement, 'latin1', (err) => {
      if (err) reject(err.message);

      resolve(filePath);
    });
  });
}

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
  const pathPromise = saveStatementFile(data);

  if (!pathPromise) {
    return false;
  }

  pathPromise.then(path => {
    const rowPromise = extractTransactionData(path);

    rowPromise.then(rows => {
      let rowCount = 0;

      if (!rows || rows.length === 0) return false;

      // TODO: Move DB operations to new service
      try {
        client.then((db => {
          db.collection(process.env.MONGO_COL_TRANSACTIONS)
            .insertMany(rows)
            .then(() => {
              rowCount = rows.length;
            });
        }));
      } catch (err) {
        console.log(err.message);
      }
    });
  });
}
