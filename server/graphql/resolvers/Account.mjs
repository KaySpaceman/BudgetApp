import graphql from 'graphql';
import {
  createAccount,
  deleteAccountById,
  getAccounts,
  getAvailableBalance,
  getSavingsBalance,
  getTotalBalance,
  updateAccount,
} from '../../services/database/repositories/account.mjs';
import { getBankById } from '../../services/database/repositories/bank.mjs';

const { GraphQLError } = graphql;

export async function accounts() {
  const rawAccounts = await getAccounts();

  return rawAccounts.map((model) => {
    const data = model.toJSON();

    return {
      ...data,
      Bank: getBankById.bind(this, data.Bank),
      Total: getTotalBalance.bind(this, data.id),
      Savings: getSavingsBalance.bind(this, data.id),
      Available: getAvailableBalance.bind(this, data.id),
    };
  });
}

export async function upsertAccount({ account }) {
  if (!account) {
    throw new GraphQLError('Received invalid account upsert request data');
  }

  return account.id ? updateAccount(account) : createAccount(account);
}

export async function deleteAccount({ accountId }) {
  if (typeof accountId !== 'string') {
    throw new GraphQLError('Received invalid account deletion request data');
  }

  const { deletedCount } = await deleteAccountById(accountId);

  return !!deletedCount;
}
