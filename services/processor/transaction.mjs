import { updateTransactions } from '../database/repository.mjs';

export default async function updateCategories(update) {
  return updateTransactions(update)
    .then((count) => count)
    .catch((reason) => {
      throw new Error(`Couldn't update transactions: ${reason}`);
    });
}
