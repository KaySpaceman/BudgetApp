import mongoose from 'mongoose';
import Transaction from '../../../models/Transaction.mjs';
import generateHash from '../../utility/checksum.mjs';

export async function getTransactions() {
  return Transaction.find({})
    .exec();
}

export async function createTransaction(data) {
  // TODO: Add data validation
  data._id = new mongoose.Types.ObjectId();
  data.Hash = generateHash(data);

  const createdTransaction = await new Transaction(data).save();

  if (!createdTransaction) {
    return null;
  }

  return createdTransaction;
}

export async function updateTransaction(data) {
  // TODO: Add data validation
  const id = data._id || data.id;

  const transaction = await Transaction.findOne({ _id: id });

  if (!transaction) {
    throw new Error('Account doesn\'t exists');
  }

  data.Hash = generateHash(data);
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
