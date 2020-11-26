import Transaction from '../../../models/Transaction.mjs';
import { getCategories } from './category.mjs';

function combineTotalsWithCategories(categories, totals) {
  return categories.map((category) => {
    const categoryId = category.id || category._id.toString();
    const dataPoint = { name: category.Name };

    if (totals[categoryId]) {
      dataPoint.value = totals[categoryId];
    }

    if (category.Children && category.Children.length > 0) {
      dataPoint.children = combineTotalsWithCategories(category.Children, totals);
    }

    return dataPoint;
  });
}

export async function getOutgoingByDate(timeUnit) {
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
        Category: { $exists: true },
        Type: { $eq: 'SPENDING' },
        Direction: { $eq: 'OUTGOING' },
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

  const groupedTotalPromise = Transaction.aggregate([
    {
      $match: {
        Category: { $exists: true },
        Type: { $eq: 'SPENDING' },
        Direction: { $eq: 'OUTGOING' },
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
        value: { $round: ['$value', 2] },
      },
    },
  ])
    .exec();

  const topCategoryPromise = getCategories([{ Level: { $lte: 1 } }, { Type: { $eq: 'SPENDING' } }]);
  const [rawTotals, topCategories] = await Promise.all([groupedTotalPromise, topCategoryPromise]);
  const totals = rawTotals.reduce((acc, cur) => {
    acc[cur._id.toString()] = cur.value;

    return acc;
  }, {});

  return {
    name: 'Total',
    children: combineTotalsWithCategories(topCategories, totals),
  };
}
