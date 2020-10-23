/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';
import Transaction from '../../../models/Transaction.mjs';
import generateHash from '../../utility/checksum.mjs';

export async function getTransactions(page = 1, perPage = 10) {
  return Transaction.aggregate([
    { $set: { HasCategory: { $and: ['$Category'] } } },
    {
      $sort: {
        HasCategory: 1,
        Date: -1,
      },
    },
    { $skip: (page - 1) * perPage },
    { $limit: perPage },
  ])
    .exec();
}

export async function createTransaction(data) {
  // TODO: Add data validation
  data._id = new mongoose.Types.ObjectId();
  data.Hash = generateHash(data);

  if (data.Type) {
    data.Direction = data.Type === 'INCOME' ? 'IN' : 'OUT';
  }

  const createdTransaction = await new Transaction(data).save();

  if (!createdTransaction) {
    return null;
  }

  return createdTransaction;
}

export async function upsertTransactions(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    throw new Error('Invalid argument. Expected array of transactions');
  }

  const promises = transactions
    .map((entry) => {
      if (entry.Type) {
        entry.Direction = entry.Type === 'INCOME' ? 'IN' : 'OUT';
      }

      return Transaction.update(
        { Hash: entry.Hash },
        { $setOnInsert: entry },
        { upsert: true },
      )
        .exec();
    });

  const response = await Promise.all(promises);

  return response.reduce((acc, cur) => acc + !!cur.upserted, 0);
}

export async function updateTransaction(data) {
  // TODO: Add data validation
  const id = new mongoose.Types.ObjectId(data._id || data.id);
  const transaction = await Transaction.findOne({ _id: id });

  if (!transaction) {
    throw new Error('Account doesn\'t exists');
  }

  data.Hash = generateHash(data);

  if (data.Type) {
    data.Direction = data.Type === 'INCOME' ? 'IN' : 'OUT';
  }

  const editedTransaction = await transaction.set(data)
    .save();

  if (!editedTransaction) {
    throw new Error('Failed to update transaction data');
  }

  return editedTransaction;
}

export async function deleteTransactionById(transactionId) {
  return Transaction.deleteOne({
    _id: { $eq: new mongoose.Types.ObjectId(transactionId) },
  })
    .exec();
}
