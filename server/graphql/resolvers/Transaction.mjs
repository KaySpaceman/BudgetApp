import graphql from 'graphql';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransactionById,
} from '../../services/database/repositories/transaction.mjs';
import { getCategoryById } from '../../services/database/repositories/category.mjs';
import { getAccountById } from '../../services/database/repositories/account.mjs';

const { GraphQLError } = graphql;

export async function transactions() {
  // TODO: Add Pagination
  const rawTransactions = await getTransactions();

  return rawTransactions.map((model) => {
    const data = model.toJSON();

    return {
      ...data,
      Category: getCategoryById.bind(this, data.Category),
      Account: getAccountById.bind(this, data.Account),
      Date: data.Date.toISOString().split('T')[0],
    };
  });
}

export async function upsertTransaction({ transaction }) {
  // TODO: Add Validation
  if (!transaction) {
    throw new GraphQLError('Received invalid transaction upsert request data');
  }

  return transaction.id ? updateTransaction(transaction) : createTransaction(transaction);
}

export async function deleteTransaction({ transactionId }) {
  // TODO: Add Validation
  if (typeof transactionId !== 'string') {
    throw new GraphQLError('Received invalid transaction deletion request data');
  }

  const { deletedCount } = await deleteTransactionById(transactionId);

  return !!deletedCount;
}
