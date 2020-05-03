import _ from 'lodash';
import connectDb from './connector.mjs';
import Transaction from '../../models/Transaction.mjs';
import Category from '../../models/Category.mjs';

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

export function getTransactions(page = 0, limit = 10) {
  return Transaction.find({})
    .skip(page > 0 ? ((page - 1) * limit) : 0)
    .limit(limit)
    .sort({ Date: -1 })
    .exec();
}

export function getCategories() {
  return Category.find({})
    .exec();
}

export function getCategoryTree() {
  return new Promise((resolve) => {
    Category.regenerateTree()
      .then(() => Category.find({ Parent: null })
        .exec()
        .then((topLevel) => {
          resolve(topLevel);
        }));
  });
}
