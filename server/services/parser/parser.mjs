import fs from 'fs';
import csv from 'csv-parser';
import _ from 'lodash';
import moment from 'moment';
import { getBankById } from '../database/repositories/bank.mjs';
import filterInvalidTransactions from '../utility/validator.mjs';
import generateHash from '../utility/checksum.mjs';
import { getAccountById } from '../database/repositories/account.mjs';

// TODO: Clean up this file

function createReadStream(path, separator = ';') {
  return fs.createReadStream(path, { encoding: 'utf8' })
    .pipe(csv({
      separator,
      headers: false,
    }));
}

function toDecimal(value) {
  if (!value) {
    return null;
  }

  const decimal = parseFloat(value.replace(',', '.'));

  return _.isNumber(decimal) ? decimal : null;
}

async function getBankModel(accountId) {
  const account = await getAccountById(accountId);

  if (!account) {
    throw new Error(`Account with Id "${accountId}" doesn't exist`);
  }

  const bankId = account.Bank;

  if (!bankId) {
    throw new Error(`Account "${accountId}" has no assigned bank"`);
  }

  const bank = await getBankById(account.Bank);

  if (!bank) {
    throw new Error(`Bank with Id "${bankId}" doesn't exist`);
  }

  return bank;
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
    return toDecimal(row[amountConfig.Combined - 1]) > 0 ? 'INCOMING' : 'OUTGOING';
  }

  return toDecimal(row[amountConfig.Incoming - 1]) ? 'INCOMING' : 'OUTGOING';
}

function extractAmount(row, amountConfig) {
  let amount;

  if (amountConfig.Combined) {
    amount = row[amountConfig.Combined - 1];
  } else {
    amount = toDecimal(row[amountConfig.Incoming - 1])
      ? row[amountConfig.Incoming - 1]
      : row[amountConfig.Outgoing - 1];
  }

  amount = toDecimal(amount);

  if (!_.isNumber(amount)) {
    return null;
  }

  amount = Math.abs(amount);

  return Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2);
}

function extractNote(value) {
  return value ? value.trim() : '';
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

function buildTransactions(row, transactions, accountId, bank) {
  const transaction = {
    Date: extractData(row[bank.Columns.Date - 1], bank.Columns.DateFormat),
    Direction: extractDirection(row, bank.Columns.Amount),
    Amount: extractAmount(row, bank.Columns.Amount),
    Note: extractNote(row[bank.Columns.Reference - 1]),
    Account: accountId,
  };

  transaction.Hash = generateHash(transaction);
  transactions.push(transaction);
}

export default async function parseTransactionData(path, accountId) {
  const bank = await getBankModel(accountId);
  const stream = createReadStream(path, bank.Separator);
  const transactions = [];

  return new Promise((resolve) => {
    stream.on('data', (row) => buildTransactions(row, transactions, accountId, bank))
      .on('end', () => removePadding(transactions, bank))
      .on('close', () => {
        resolve(filterInvalidTransactions(transactions));
      });
  });
}
