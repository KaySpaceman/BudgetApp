export function isTransactionValid(transaction) {
  return transaction.Date && transaction.Amount && transaction.Account;
}

export default function filterInvalidTransactions(transactions) {
  return transactions.filter(isTransactionValid);
}
