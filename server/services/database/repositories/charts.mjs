import Transaction from '../../../models/Transaction.mjs';
import Category from '../../../models/Category.mjs';
import { getSystemCategoryIds } from './category.mjs';

function combineTotalsWithCategories(categories, totals) {
  return categories.map((category) => {
    const categoryId = category._id.toString();
    const dataPoint = { Name: category.Name };

    if (totals[categoryId]) {
      dataPoint.Value = totals[categoryId];
    }

    if (category.Children && category.Children.length > 0) {
      dataPoint.Children = combineTotalsWithCategories(category.Children, totals);
    }

    return dataPoint;
  });
}

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

export async function getOutgoingByCategory(timePeriod) {
  const systemCategories = await getSystemCategoryIds(false);
  const dateFilter = new Date();

  switch (timePeriod) {
    case 'LAST_MONTH':
      dateFilter.setMonth(dateFilter.getMonth() - 1);
      break;
    case 'LAST_QUARTER':
      dateFilter.setMonth(dateFilter.getMonth() - 3);
      break;
    case 'LAST_HALF_YEAR':
      dateFilter.setMonth(dateFilter.getMonth() - 6);
      break;
    case 'LAST_YEAR':
      dateFilter.setMonth(dateFilter.getMonth() - 12);
      break;
    default:
      dateFilter.setMonth(dateFilter.getMonth() - 3);
  }

  const promiseGroupedTotals = Transaction.aggregate([
    {
      $match: {
        Category: { $exists: true, $nin: systemCategories },
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

  const [rawTotals, topCategories] = await Promise.all(
    [promiseGroupedTotals, promiseTopCategories],
  );

  const totals = rawTotals.reduce((acc, cur) => {
    acc[cur._id.toString()] = cur.value;

    return acc;
  }, {});

  return {
    Name: 'Total',
    Children: combineTotalsWithCategories(topCategories, totals),
  };
}
