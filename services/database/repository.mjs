/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import mongoose from 'mongoose';
import Transaction from '../../models/Transaction.mjs';
import Category from '../../models/Category.mjs';
import { objArrToObj } from '../utility/formatter.mjs';

// TODO: Move functions to separate repositories

export default function saveTransactions(data) {
  return new Promise((resolve, reject) => {
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
          resolve(
            newEntries.reduce(
              (count, current) => count + !_.isNil(current.upserted), 0,
            ),
          );
        });
    } catch (error) {
      reject(error);
    }
  });
}

export function updateTransactions(data) {
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

export function getCategories() {
  return Category.find({})
    .exec();
}

export function getSystemCategoryIds(asString = true) {
  return Category.find({ IsSystem: true })
    .select('_id')
    .exec()
    .then((systemCategories) => {
      if (asString) {
        return systemCategories.map((cat) => cat._id.toString());
      }

      return systemCategories.map((cat) => cat._id);
    });
}

export async function getOutgoingByDate(interval = 'month') {
  const systemCategories = await getSystemCategoryIds(false);
  let dateString = '%Y-%m';

  switch (interval) {
    case 'day':
      dateString = '%Y-%m-%d';
      break;
    case 'month':
      dateString = '%Y-%m';
      break;
    case 'quarter':
      // TODO: Implement grouping by quarter
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

export async function getOutgoingByCategory() {
  const systemCategories = await getSystemCategoryIds(false);

  // TODO: Add quarter/month/week grouping
  const promiseGroupedTotals = Transaction.aggregate([
    {
      $match: {
        Category: { $nin: systemCategories },
        Direction: { $eq: 'OUT' },
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

  return Promise.all([promiseGroupedTotals, promiseTopCategories])
    .then(async ([totals, topCategories]) => {
      const children = await Category.assignTotalsToCategories(
        topCategories,
        objArrToObj(totals, '_id', 'value'),
      );

      return {
        name: 'Total',
        children,
      };
    });
}

export function regenerateTree() {
  return Category.regenerateTree();
}

export async function createCategory(name, parent = null) {
  const newCategory = new Category({
    _id: new mongoose.Types.ObjectId(),
    Name: name,
  });

  newCategory.IdString = newCategory._id.toString();

  if (parent) {
    newCategory.Parent = parent;
  }

  const savedCategory = await newCategory.save();
  await regenerateTree();

  return savedCategory;
}

export function getCategoryTree() {
  return new Promise((resolve) => {
    Category.find({ Parent: null })
      .exec()
      .then((topLevel) => {
        const haveTrees = topLevel.filter(
          (cat) => Array.isArray(cat.Children) && cat.Children.length > 0,
        );

        if (!Array.isArray(haveTrees) || haveTrees.length < 1) {
          regenerateTree()
            .then(() => Category.find({ Parent: null })
              .exec()
              .then((newTopLevel) => {
                resolve(newTopLevel);
              }));
        } else {
          resolve(topLevel);
        }
      });
  });
}

export async function deleteCategory(categoryId) {
  const cleanup = [];
  let categoryIds = await Category.findById(categoryId)
    .exec()
    .then((category) => {
      if (!category) return [];

      const childIds = Category.findDescendantIds(category.Children);

      childIds.push(category._id);

      return childIds;
    });

  const systemCategoryIds = await getSystemCategoryIds();

  categoryIds = categoryIds.filter(
    (id) => !systemCategoryIds.includes(id.toString()),
  );

  cleanup.push(
    Transaction.where({ Category: { $in: categoryIds } })
      .update({ $unset: { Category: '' } })
      .exec(),
  );

  cleanup.push(
    Category.deleteMany({ _id: { $in: categoryIds } })
      .exec()
      .then(async () => regenerateTree()),
  );

  return Promise.all(cleanup);
}
