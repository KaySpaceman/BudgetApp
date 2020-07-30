/* eslint-disable func-names */
import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: { type: String, required: true },
  Separator: { type: String, max: 1, default: ';' },
  Columns: {
    Date: { type: Number, required: true, min: 1 },
    DateFormat: { type: String },
    Reference: { type: Number, required: true, min: 1 },
    Amount: {
      Combined: { type: Number, min: 1 },
      Incoming: { type: Number, min: 1 },
      Outgoing: { type: Number, min: 1 },
    },
  },
  Padding: {
    Top: { type: Number, min: 1 },
    Bottom: { type: Number, min: 1 },
  },
});

bankSchema.methods.toJSON = function () {
  return {
    _id: this._id.toString(),
    Name: this.Name,
    Separator: this.Separator,
    Columns: {
      Date: this.Columns.Date ? this.Columns.Date.toString() : null,
      DateFormat: this.Columns.DateFormat,
      Reference: this.Columns.Reference,
      Amount: {
        Combined: this.Columns.Amount.Combined,
        Incoming: this.Columns.Amount.Incoming,
        Outgoing: this.Columns.Amount.Outgoing,
      },
    },
    Padding: {
      Top: this.Padding.Top,
      Bottom: this.Padding.Bottom,
    },
  };
};

export default mongoose.model('Bank', bankSchema, 'Banks');
