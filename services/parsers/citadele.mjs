import fs from 'fs';
import csv from 'csv-parser';
import crypto from 'crypto';
import _ from 'lodash';

// TODO: Add bank selector
const BANK_CITADELE = 'Citadele';
const ENCODING = 'utf8';

export default function parseTransactionData(path) {
  const rows = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path, { encoding: ENCODING })
      .pipe(csv({ separator: '|' }))
      .on('error', (err) => {
        reject(err);
      })
      .on('data', (row) => {
        let entry = {
          Date: new Date(row[0]),
          Type: row[1],
          Direction: row[5] > 0 ? 'IN' : 'OUT',
          In: row[5] > 0 ? row[5] : null,
          Out: row[5] < 0 ? row[5] : null,
          Note: row[2],
          Bank: BANK_CITADELE,
        };

        entry = _.omitBy(entry, _.isNil);

        // TODO: Move to new hash operation service
        entry.Hash = crypto.createHash('sha256')
          .update(JSON.stringify(entry), 'utf8')
          .digest('hex');

        rows.push(entry);
      })
      .on('end', () => {
        resolve(rows.splice(2, rows.length - 7));
      });
  });
}
