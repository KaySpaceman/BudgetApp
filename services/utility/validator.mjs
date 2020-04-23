export default function validateTransactions(transactions) {
  return transactions.filter((entry) => entry.Date && (entry.In || entry.Out) && entry.Bank);
}
