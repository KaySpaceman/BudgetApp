/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import mongoose from 'mongoose';
import connectDb from './connector.mjs';
import Transaction from '../../models/Transaction.mjs';
import Category from '../../models/Category.mjs';

// TODO: Move functions to separate repositories

export default function saveTransactions(data) {
  return new Promise((resolve, reject) => {
    connectDb()
      .then((db) => {
        const collection = db.collection(process.env.MONGO_COL_TRANSACTIONS);

        try {
          const insertPromises = Object.values(data)
            .map((entry) => collection.update(
              { Hash: entry.Hash },
              { $setOnInsert: entry },
              { upsert: true },
            ));

          Promise.all(insertPromises)
            .then((newEntries) => {
              resolve(
                newEntries.reduce(
                  (count, current) => count + !_.isNil(current.result.upserted), 0,
                ),
              );
            });
        } catch (error) {
          reject(error);
        }
      });
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

export function getTransactions(page = 0, limit = 100) {
  return Transaction.aggregate([
    { $set: { HasCategory: { $and: ['$Category'] } } },
    {
      $sort: {
        HasCategory: 1,
        Date: -1,
      },
    },
  ])
    .limit(limit)
    .skip(page > 0 ? ((page - 1) * limit) : 0)
    .exec();
}

export function getCategories() {
  return Category.find({})
    .exec();
}

export function regenerateTree() {
  return Category.regenerateTree();
}

export async function createCategory(name, parent = null) {
  const newCategory = new Category({
    _id: new mongoose.Types.ObjectId(),
    Name: name,
  });

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

  const systemCategoryIds = await Category.find({ IsSystem: true })
    .select('_id')
    .exec()
    .then((systemCategories) => systemCategories.map((cat) => cat._id.toString()));

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
