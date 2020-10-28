import graphql from 'graphql';
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

const { GraphQLError } = graphql;

export async function transactions({ page = 1, perPage = 10 }) {
  const rawTransactions = await getTransactions(page, perPage);

  return rawTransactions.map((data) => ({
    ...data,
    id: data._id.toString(),
    Category: getCategoryById.bind(this, data.Category),
    Account: getAccountById.bind(this, data.Account),
    Date: data.Date.toISOString().split('T')[0],
  }));
}

export async function upsertTransaction({ transaction }) {
  // TODO: Add Validation
  if (!transaction) {
    throw new GraphQLError('Received invalid transaction upsert request data');
  }

  const response = transaction.id ? await updateTransaction(transaction)
    : await createTransaction(transaction);
  const data = response.toJSON();

  return {
    ...data,
    Category: getCategoryById.bind(this, data.Category),
    Account: getAccountById.bind(this, data.Account),
    Date: data.Date.toISOString().split('T')[0],
  };
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
  returnTransactions.push(updatedTransaction);

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
    returnTransactions.push(createdTransferTransaction);

    if (createdTransferTransaction.Type !== 'TRANSFER') {
      throw new GraphQLError('Error when setting TRANSFER type');
    }
  }

  return returnTransactions.map((data) => ({
    ...data.toJSON(),
    id: data._id.toString(),
    Category: getCategoryById.bind(this, data.Category),
    Account: getAccountById.bind(this, data.Account),
    Date: data.Date.toISOString().split('T')[0],
  }));
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
