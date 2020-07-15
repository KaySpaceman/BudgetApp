import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Date,
  Direction: String,
  Note: String,
  Amount: Number,
  Hash: String,
  Category: { type: mongoose.ObjectId, ref: 'Category' },
  Account: { type: mongoose.ObjectId, ref: 'Account' },
});

export default mongoose.model('Transaction', transactionSchema, 'Transactions');
