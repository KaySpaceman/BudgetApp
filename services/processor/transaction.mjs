import { updateTransactions } from '../database/repository.mjs';

export default function updateCategories(update) {
  return new Promise((resolve, reject) => {
    updateTransactions(update)
      .then((count) => {
        resolve(count);
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}
