import graphql from 'graphql';
import { getUserById } from '../../services/database/repositories/user.mjs';

const { GraphQLError } = graphql;

// eslint-disable-next-line no-unused-vars,import/prefer-default-export
export async function loginUser({ email, password }) {
  // TODO: Implement proper authentication
  const userId = process.env.DEV_USER_ID;
  const user = await getUserById(userId);

  if (!user) {
    throw new GraphQLError('Failed to log in user');
  }

  return {
    Username: user.Username,
    FirstName: user.FirstName,
    LastName: user.LastName,
    FullName: user.FullName,
    UnassignedSavings: user.Vaults.UnassignedBalances.Savings,
    UnassignedInvestments: user.Vaults.UnassignedBalances.Buffer,
    BufferMonths: user.Vaults.BufferMonths,
  };
}

export async function unassignedSavings() {
  // TODO: Implement proper authentication
  const userId = process.env.DEV_USER_ID;
  const user = await getUserById(userId);

  if (!user) {
    throw new GraphQLError('User doesn\'t exist');
  }

  return user.Vaults.UnassignedBalances.Savings;
}
