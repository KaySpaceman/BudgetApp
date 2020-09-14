import {
  getOutgoingByCategory,
  getOutgoingByDate,
} from '../../services/database/repositories/charts.mjs';

export async function totalSpendingChart({ timeUnit }) {
  return getOutgoingByDate(timeUnit);
}

export async function categorizedSpendingChart({ timePeriod }) {
  return getOutgoingByCategory(timePeriod);
}
