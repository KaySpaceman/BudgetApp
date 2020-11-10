/* eslint-disable func-names */
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Date: { type: Date, required: true },
  Direction: { type: String, required: true },
  Type: String,
  Note: String,
  Amount: { type: Number, required: true },
  Hash: String,
  Category: { type: mongoose.ObjectId, ref: 'Category' },
  Account: { type: mongoose.ObjectId, ref: 'Account', required: true },
});

transactionSchema.methods.toJSON = function () {
  return {
    id: this.id,
    Date: this.Date,
    Direction: this.Direction,
    Type: this.Type,
    Note: this.Note,
    Amount: this.Amount,
    Hash: this.Hash,
    Category: this.Category ? this.Category.toString() : null,
    Account: this.Account.toString(),
  };
};

transactionSchema.virtual('id').set(function (newId) {
  try {
    this._id = new mongoose.Types.ObjectId(newId);
  } catch (e) {
    // New id was invalid. Don't change model's _id
  }
});

export default mongoose.model('Transaction', transactionSchema, 'Transactions');
