import fs from 'fs';
import csv from 'csv-parser';
import _ from 'lodash';
import generateHash from '../utility/checksum.mjs';
import validateTransactions from '../utility/validator.mjs';

const BANK_REVOLUT = 'Revolut';
const ENCODING = 'utf8';

function trimRows(rows) {
  return rows.splice(0, rows.length);
}

function toDecimal(value) {
  return parseFloat(value.replace(',', '.'));
}

export default function parseTransactionData(path) {
  const rows = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path, { encoding: ENCODING })
      .pipe(csv({ separator: ';' }))
      .on('error', (err) => {
        reject(err);
      })
      .on('data', (row) => {
        const values = Object.values(row);
        values[2] = toDecimal(values[2]);
        values[3] = toDecimal(values[3]);

        let entry = {
          Date: new Date(values[0].trim()),
          Type: values[7],
          Direction: values[3] > 0 ? 'IN' : 'OUT',
          Amount: values[3] ? values[3] : values[2],
          Note: values[1],
          Bank: BANK_REVOLUT,
        };

        entry = _.omitBy(entry, _.isNil);
        entry.Hash = generateHash(entry);

        rows.push(entry);
      })
      .on('end', () => {
        resolve(validateTransactions(trimRows(rows)));
      });
  });
}
