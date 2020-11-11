import graphql from 'graphql';
import { getUserById, updateUser } from '../../services/database/repositories/user.mjs';
import {
  getAccountById,
  getAvailableBalance,
  getSavingsBalance,
} from '../../services/database/repositories/account.mjs';
import { createTransaction } from '../../services/database/repositories/transaction.mjs';
import { formatTransaction } from './Transaction.mjs';

const { GraphQLError } = graphql;

function formatUser(user) {
  return {
    Username: user.Username,
    FirstName: user.FirstName,
    LastName: user.LastName,
    FullName: user.FullName,
    UnassignedSavings: user.UnassignedSavings,
    UnassignedInvestments: user.UnassignedInvestments,
    BufferMonths: user.Vaults.BufferMonths,
  };
}

// eslint-disable-next-line no-unused-vars
export async function loginUser({ email, password }) {
  // TODO: Implement proper authentication
  const userId = process.env.DEV_USER_ID;
  const user = await getUserById(userId);

  if (!user) throw new GraphQLError('Failed to log in user');

  return formatUser(user);
}

export async function unassignedSavings() {
  // TODO: Implement proper authentication
  const userId = process.env.DEV_USER_ID;
  const user = await getUserById(userId);

  if (!user) throw new GraphQLError('User doesn\'t exist');

  return user.UnassignedSavings;
}

async function handleSavingsDeposit(user, account, amount) {
  const { UnassignedSavings } = user;
  const accountAvailable = await getAvailableBalance(account.id);

  if (amount > accountAvailable) throw new GraphQLError('Insufficient available funds in account');

  const transfer = await createTransaction({
    Account: account._id,
    Amount: amount,
    Type: 'SAVINGS',
    Direction: 'OUT',
    Date: new Date(),
    Note: 'Savings deposit',
  });

  if (!transfer) throw new GraphQLError('Failed to create savings deposit transaction');

  user.set({ UnassignedSavings: UnassignedSavings + amount });
  await updateUser(user);

  return transfer;
}

async function handleSavingsWithdrawal(user, account, amount) {
  const { UnassignedSavings } = user;
  const accountSavings = await getSavingsBalance(account.id);

  if (amount > accountSavings) {
    throw new GraphQLError('Insufficient account funds allocated to savings');
  }

  const transfer = await createTransaction({
    Account: account._id,
    Amount: amount,
    Type: 'SAVINGS',
    Direction: 'IN',
    Date: new Date(),
    Note: 'Savings withdrawal',
  });

  if (!transfer) throw new GraphQLError('Failed to create savings withdrawal transaction');

  user.set({ UnassignedSavings: UnassignedSavings - amount });
  await updateUser(user);

  return transfer;
}

export async function createSavingsTransfer({ accountId, amount, direction }) {
  if (!accountId || amount <= 0 || !direction) { // TODO: Validate form data
    throw new GraphQLError('Received invalid savings transfer request data');
  }

  const [user, account] = await Promise.all( // TODO: Replace later with proper user auth
    [getUserById(process.env.DEV_USER_ID), getAccountById(accountId)],
  );
  const fixedAmount = Number.parseFloat(amount.toFixed(2));

  if (!user) throw new GraphQLError('User doesn\'t exist');
  if (!account) throw new GraphQLError('Account doesn\'t exist');

  switch (direction) {
    case 'INCOMING':
      return formatTransaction(await handleSavingsDeposit(user, account, fixedAmount));
    case 'OUTGOING':
      return formatTransaction(await handleSavingsWithdrawal(user, account, fixedAmount));
    default:
      throw new GraphQLError('Invalid transfer direction');
  }
}
