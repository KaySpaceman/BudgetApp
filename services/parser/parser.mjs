import { getBankById } from '../database/repositories/bank.mjs';
import fs from 'fs';
import csv from 'csv-parser';
import _ from 'lodash';
import generateHash from '../utility/checksum.mjs';
import validateTransactions from '../utility/validator.mjs';
import moment from 'moment';

export const DATE_FORMATS = [
  'DD/MM/YYYY',
  'DD-MMM-YY',
  'DD.MM.YY',
];

export default async function parseTransactionData(path, bankId) {
  const bank = await getBankModel(bankId);
  const stream = createReadStream(path, bank.Separator);
  const transactions = [];

  return new Promise((resolve) => {
    stream.on('data', (row) => buildTransactions(row, transactions, bank))
      .on('end', () => removePadding(transactions, bank))
      .on('close', () => {
        resolve(validateTransactions(transactions));
      });
  });
}

async function getBankModel(bankId) {
  const bank = await getBankById(bankId);

  if (!bank) {
    throw new Error(`Bank with Id "${bank}" doesn't exist`);
  }

  return bank;
}

function createReadStream(path, separator = ';') {
  return fs.createReadStream(path, { encoding: 'utf8' })
    .pipe(csv({
      separator,
      headers: false,
    }));
}

function buildTransactions(row, transactions, bank) {
  let transaction = {
    Date: extractData(row[bank.Columns.Date - 1], bank.Columns.DateFormat),
    Direction: extractDirection(row, bank.Columns.Amount),
    Amount: extractAmount(row, bank.Columns.Amount),
    Note: extractNote(row[bank.Columns.Reference - 1]),
    Bank: bank._id,
  };

  transaction.Hash = generateHash(transaction);

  transactions.push(transaction);
}

function extractData(value, format) {
  if (!value) {
    return null;
  }

  const momentDate = moment(value.trim(), format);

  return momentDate.isValid() ? momentDate.toDate() : null;
}

function extractDirection(row, amountConfig) {
  if (amountConfig.Combined) {
    return toDecimal(row[amountConfig.Combined - 1]) > 0 ? 'IN' : 'OUT';
  }

  return toDecimal(row[amountConfig.Incoming - 1]) ?
    'IN' :
    toDecimal(row[amountConfig.Outgoing - 1]) ? 'OUT' : null;
}

function extractAmount(row, amountConfig) {
  let amount;

  if (amountConfig.Combined) {
    amount = row[amountConfig.Combined - 1];
  } else {
    amount = toDecimal(row[amountConfig.Incoming - 1]) ?
      row[amountConfig.Incoming - 1] :
      row[amountConfig.Outgoing - 1];
  }

  amount = toDecimal(amount);

  if (_.isNumber(amount)) {
    amount = Math.abs(amount);
  }

  return amount;
}

function extractNote(value) {
  return value ? value.trim() : null;
}

function removePadding(transactions, bank) {
  const padding = bank.Padding;

  if (!padding) {
    return transactions;
  }

  const top = padding.Top ? padding.Top - 1 : 0;
  const bottom = padding.Bottom ? transactions.length - padding.Bottom : transactions.length;

  return transactions.slice(top, bottom);
}

function toDecimal(value) {
  if (!value) {
    return null;
  }

  return parseFloat(value.replace(',', '.')) ?? null;
}
