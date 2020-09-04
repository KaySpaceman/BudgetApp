import mongoose from 'mongoose';
import Transaction from '../../models/Transaction.mjs';
import Category from '../../models/Category.mjs';
import { objArrToObj } from '../utility/formatter.mjs';

// TODO: Move functions to separate repositories

export function saveTransactions(data) {
  // TODO: Move to Transaction repository
  // TODO: Rework
  return new Promise((resolve, reject) => {
    if (!Array.isArray(data)) {
      data = [data];
    }

    try {
      const insertPromises = Object.values(data)
        .map((entry) => Transaction.update(
          { Hash: entry.Hash },
          { $setOnInsert: entry },
          { upsert: true },
        )
          .exec());

      Promise.all(insertPromises)
        .then((newEntries) => {
          resolve(newEntries);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export function updateTransactions(data) {
  // TODO: Move to Transaction repository
  // TODO: Rework
  return new Promise((resolve, reject) => {
    try {
      const updatePromises = Object.entries(data)
        .map(([identifier, value]) => {
          Transaction.updateOne({ _id: identifier }, { Category: value })
            .exec();
        });

      Promise.all(updatePromises)
        .then((newEntries) => {
          resolve(newEntries.length);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export function getTransactions(page = 0, limit = 40) {
  // TODO: Move to Transaction repository
  // TODO: Rework
  return Transaction.aggregate([
    {
      $set: {
        HasCategory: { $and: ['$Category'] },
        IdString: { $convert: { input: '$_id', to: 'string' } },
        CategoryIdString: { $convert: { input: '$Category', to: 'string' } },
        DateString: { $dateToString: { format: '%d/%m/%Y', date: '$Date' } },
        CategoryName: [],
      },
    },
    {
      $sort: {
        HasCategory: 1,
        Date: -1,
      },
    },
    {
      $lookup:
        {
          from: 'Categories',
          localField: 'Category',
          foreignField: '_id',
          as: 'CategoryName',
        },
    },
    {
      $unwind:
        {
          path: '$CategoryName',
          preserveNullAndEmptyArrays: true,
        },
    },
    { $set: { CategoryName: '$CategoryName.Name' } },
  ])
    .limit(limit)
    .skip(page > 0 ? ((page - 1) * limit) : 0)
    .exec();
}

export async function getOutgoingByDate(interval = 'month') {
  // TODO: Move to Chart repository
  // TODO: Rework
  const systemCategories = await getSystemCategoryIds(false);
  let dateString = '%Y-%m';

  switch (interval) {
    case 'day':
      dateString = '%Y-%m-%d';
      break;
    case 'month':
      dateString = '%Y-%m';
      break;
    case 'year':
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
        date: '$_id',
        value: '$value',
      },
    },
  ])
    .exec();
}

export async function getOutgoingByCategory(timePeriod = 'quarterly') {
  // TODO: Move to Chart repository
  // TODO: Rework
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
}
