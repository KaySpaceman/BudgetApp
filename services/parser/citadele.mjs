import fs from 'fs';
import csv from 'csv-parser';
import _ from 'lodash';
import generateHash from '../utility/checksum.mjs';

// TODO: Add bank selector
const BANK_CITADELE = 'Citadele';
const ENCODING = 'utf8';

function trimRows(rows) {
  return rows.splice(2, rows.length - 7);
}

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
        entry.Hash = generateHash(entry);

        rows.push(entry);
      })
      .on('end', () => {
        resolve(trimRows(rows));
      });
  });
}
