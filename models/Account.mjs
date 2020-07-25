/* eslint-disable no-underscore-dangle, func-names */
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: { type: String, required: true },
  Number: { type: String },
  Bank: { type: mongoose.ObjectId, ref: 'Bank' },
});

accountSchema.methods.toJSON = function () {
  return {
    _id: this._id.toString(),
    Name: this.Name,
    Number: this.Number,
    Bank: this.Bank ? this.Bank.toString() : null,
  };
};

export default mongoose.model('Account', accountSchema, 'Accounts');
