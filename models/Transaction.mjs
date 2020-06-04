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
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

transactionSchema.virtual('IdString').get(function () {
  return this._id.toString();
});

transactionSchema.virtual('CategoryIdString').get(function () {
  return this.Category.toString();
});

export default mongoose.model('Transaction', transactionSchema, 'Transactions');
