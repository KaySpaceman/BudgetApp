import graphql from 'graphql';
import { getOutgoingByDate } from '../../services/database/repositories/charts.mjs';

const { GraphQLError } = graphql;

export async function totalSpendingChart({ timeUnit }) {
  return getOutgoingByDate(timeUnit);
}
