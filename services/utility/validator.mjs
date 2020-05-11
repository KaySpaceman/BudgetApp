export default function validateTransactions(transactions) {
  return transactions.filter((entry) => entry.Date && entry.Amount && entry.Bank);
}
