import Transaction from '../../../models/Transaction.mjs';
// import Category from '../../../models/Category.mjs';
// import { objArrToObj } from '../../utility/formatter.mjs';
import { getSystemCategoryIds } from './category.mjs';

export async function getOutgoingByDate(timeUnit) {
  const systemCategories = await getSystemCategoryIds();
  let dateString;

  // TODO: Implement quarterly, bi-weekly... grouping
  switch (timeUnit) {
    case 'DAILY':
      dateString = '%Y-%m-%d';
      break;
    case 'MONTHLY':
      dateString = '%Y-%m';
      break;
    case 'ANNUAL':
      dateString = '%Y';
      break;
    default:
      dateString = '%Y-%m';
  }

  return Transaction.aggregate([
    {
      $match: {
        Category: { $nin: systemCategories },
        Direction: { $eq: 'OUT' },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateString,
            date: '$Date',
          },
        },
        value: { $sum: { $abs: '$Amount' } },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        x: '$_id',
        y: '$value',
      },
    },
  ])
    .exec();
}

export async function getOutgoingByCategory(timePeriod = 'quarterly') {
  // TODO: Move to Chart repository
  // TODO: Rework
  /*
  const systemCategories = await getSystemCategoryIds(false);
  const dateFilter = new Date();

  switch (timePeriod) {
    case 'monthly':
      dateFilter.setMonth(dateFilter.getMonth() - 1);
      break;
    case 'quarterly':
      dateFilter.setMonth(dateFilter.getMonth() - 3);
      break;
    case 'semiannual':
      dateFilter.setMonth(dateFilter.getMonth() - 6);
      break;
    case 'annual':
      dateFilter.setMonth(dateFilter.getMonth() - 12);
      break;
    default:
      dateFilter.setMonth(dateFilter.getMonth() - 3);
  }

  const promiseGroupedTotals = Transaction.aggregate([
    {
      $match: {
        Category: { $nin: systemCategories },
        Direction: { $eq: 'OUT' },
        Date: { $gte: dateFilter },
      },
    },
    {
      $group: {
        _id: '$Category',
        value: { $sum: { $abs: '$Amount' } },
      },
    },
    {
      $project: {
        _id: 1,
        value: '$value',
      },
    },
  ])
    .exec();

  const promiseTopCategories = Category.aggregate([
    {
      $match: { Parent: null },
    },
    {
      $project: {
        _id: 1,
        Name: 1,
        Children: 1,
      },
    },
  ])
    .exec();

  const [totals, topCategories] = await Promise.all([promiseGroupedTotals, promiseTopCategories]);
  const children = await Category.assignTotalsToCategories(
    topCategories,
    objArrToObj(totals, '_id', 'value'),
  );

  return {
    name: 'Total',
    children,
  };
   */
}
