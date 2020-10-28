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
  Vault: { type: mongoose.ObjectId, ref: 'Vault' }, // TODO: Might change. Remove if so
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
    Vault: this.Vault ? this.Vault.toString() : null,
    Account: this.Account.toString(),
  };
};

export default mongoose.model('Transaction', transactionSchema, 'Transactions');
