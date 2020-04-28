import _ from 'lodash';
import Mongo from 'mongodb';
import connectDb from './connector.mjs';

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
    connectDb()
      .then((db) => {
        const collection = db.collection(process.env.MONGO_COL_TRANSACTIONS);

        try {
          const updatePromises = Object.entries(data)
            .map(([identifier, value]) => collection.updateOne(
              { _id: Mongo.ObjectID(identifier) },
              { $set: { Category: value } },
            ));

          Promise.all(updatePromises)
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

export function getTransactions(page = 0, limit = 10) {
  return new Promise((resolve) => {
    connectDb()
      .then((db) => {
        const collection = db.collection(process.env.MONGO_COL_TRANSACTIONS);

        const result = collection.find({})
          .skip(page > 0 ? ((page - 1) * limit) : 0)
          .limit(limit)
          .sort({ Date: -1 })
          .toArray();

        resolve(result);
      });
  });
}

export function getCategories() {
  return new Promise((resolve) => {
    connectDb()
      .then((db) => {
        const collection = db.collection(process.env.MONGO_COL_CATEGORIES);

        resolve(collection.find({})
          .toArray());
      });
  });
}
