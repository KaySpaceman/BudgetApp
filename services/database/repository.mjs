import connectDb from './connector.mjs';

export default function saveTransactions(data) {
  return new Promise((resolve, reject) => {
    connectDb()
      .then((db) => {
        db.collection(process.env.MONGO_COL_TRANSACTIONS)
          .insertMany(data)
          .then(() => {
            const count = data.length;

            console.log(`Imported ${count} transactions to the DB`);

            resolve(count);
          })
          .catch((reason) => {
            console.log(`Failed to import transactions: ${reason}`);

            reject(reason);
          });
      });
  });
}
