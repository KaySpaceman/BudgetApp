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

export default mongoose.model('Bank', bankSchema, 'Banks');
