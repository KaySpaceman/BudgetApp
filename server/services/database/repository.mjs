import Transaction from '../../models/Transaction.mjs';

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
