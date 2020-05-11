import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Date,
  Type: String,
  Direction: String,
  Note: String,
  Amount: Number,
  Bank: String,
  Hash: String,
  Category: { type: mongoose.ObjectId, ref: 'Category' },
});

export default mongoose.model('Transaction', transactionSchema, 'Transactions');
