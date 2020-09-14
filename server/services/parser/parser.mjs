import { getBankById } from '../database/repositories/bank.mjs';
import fs from 'fs';
import csv from 'csv-parser';
import _ from 'lodash';
import generateHash from '../utility/checksum.mjs';
import filterInvalidTransactions from '../utility/validator.mjs';
import moment from 'moment';
import { getAccountById } from '../database/repositories/account.mjs';

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

function createReadStream(path, separator = ';') {
  return fs.createReadStream(path, { encoding: 'utf8' })
    .pipe(csv({
      separator,
      headers: false,
    }));
}

function buildTransactions(row, transactions, accountId, bank) {
  let transaction = {
    Date: extractData(row[bank.Columns.Date - 1], bank.Columns.DateFormat),
    Direction: extractDirection(row, bank.Columns.Amount),
    Amount: extractAmount(row, bank.Columns.Amount),
    Note: extractNote(row[bank.Columns.Reference - 1]),
    Account: accountId,
    Bank: bank._id,
  };

  if (transaction.Direction === 'OUT') {
    transaction.Amount = -1 * Math.abs(transaction.Amount);
  } else {
    transaction.Amount = Math.abs(transaction.Amount);
  }

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
