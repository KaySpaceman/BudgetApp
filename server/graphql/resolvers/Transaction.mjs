import graphql from 'graphql';
import mongoose from 'mongoose';
import {
  createTransaction,
  getTransactions,
  getTransactionCount,
  updateTransaction,
  deleteTransactionById,
} from '../../services/database/repositories/transaction.mjs';
import { getCategoryById } from '../../services/database/repositories/category.mjs';
import { getAccountById } from '../../services/database/repositories/account.mjs';
import Account from '../../models/Account.mjs';
import { getUserById, updateUser } from '../../services/database/repositories/user.mjs';
import Transaction from '../../models/Transaction.mjs';

const { GraphQLError } = graphql;

export function formatTransaction(transaction) {
  const data = transaction instanceof Transaction ? transaction.toJSON() : transaction;

  return {
    ...data,
    id: data.id || data._id.toString(),
    Category: getCategoryById.bind(this, data.Category),
    Account: getAccountById.bind(this, data.Account),
    Date: data.Date.toISOString().split('T')[0],
  };
}

export async function transactions({ page = 1, perPage = 10 }) {
  const rawTransactions = await getTransactions(page, perPage);

  return rawTransactions.map((t) => formatTransaction(t));
}

async function handleSavingsUpsert(transaction) {
  const userId = process.env.DEV_USER_ID; // TODO: Replace later with proper user auth!!!!
  const amount = transaction.Amount;

  const user = await getUserById(userId);
  const { UnassignedSavings } = user;

  if (!user || !user.id) throw new GraphQLError('User doesn\'t exist');
  if (!amount) throw new GraphQLError('Invalid transaction amount value');

  user.set({ UnassignedSavings: UnassignedSavings + amount });
  await updateUser(user);

  // eslint-disable-next-line no-param-reassign
  transaction.Note = 'Savings deposit'; // TODO: Replace with setter when switched to models
  // eslint-disable-next-line no-param-reassign
  transaction.Category = null;

  return transaction;
}

export async function upsertTransaction({ transaction: formData }) {
  // TODO: Add Validation
  if (!formData) throw new GraphQLError('Received invalid transaction upsert request data');

  let transaction = formData; // TODO: Create model if data is valid

  if (formData.Type === 'SAVINGS') {
    transaction = await handleSavingsUpsert(transaction);
  }

  const response = transaction.id ? await updateTransaction(transaction)
    : await createTransaction(transaction);

  return formatTransaction(response);
}

export async function createTransferTransaction({ transaction, destination, createCopy }) {
  // TODO: Add Validation
  const returnTransactions = [];
  const [originAcc, destinationAcc] = await Promise.all(
    [getAccountById(transaction.Account), getAccountById(destination)],
  );

  if (!transaction || !transaction.id) {
    throw new GraphQLError('Received invalid transfer creation request data');
  }

  if (!(originAcc instanceof Account && destinationAcc instanceof Account)) {
    throw new GraphQLError('Origin or destination account couldn\'t be found');
  }

  const transfer = {
    ...transaction,
    Type: 'TRANSFER',
    Note: `Outgoing transfer from ${originAcc.Name} to ${destinationAcc.Name}`,
  };
  delete transfer.Category;

  const updatedTransaction = await updateTransaction(transfer);
  returnTransactions.push(updatedTransaction.toJSON());

  if (updatedTransaction.Type !== 'TRANSFER') {
    throw new GraphQLError('Error when setting TRANSFER type');
  }

  if (createCopy) {
    const transferCopy = {
      ...updatedTransaction.toJSON(),
      Account: destinationAcc.id,
      Direction: 'IN',
      Note: `Incoming transfer from ${destinationAcc.Name} to ${originAcc.Name}`,
    };

    const createdTransferTransaction = await createTransaction(transferCopy);
    returnTransactions.push(createdTransferTransaction.toJSON());

    if (createdTransferTransaction.Type !== 'TRANSFER') {
      throw new GraphQLError('Error when setting TRANSFER type');
    }
  }

  return returnTransactions.map((t) => formatTransaction(t));
}

export async function deleteTransaction({ transactionId }) {
  // TODO: Add Validation
  if (typeof transactionId !== 'string') {
    throw new GraphQLError('Received invalid transaction deletion request data');
  }

  const { deletedCount } = await deleteTransactionById(transactionId);

  return !!deletedCount;
}

export async function transactionCount() {
  return getTransactionCount();
}
