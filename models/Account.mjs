import mongoose from 'mongoose';

const account = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: { type: String, required: true },
  Number: { type: String },
  Bank: { type: mongoose.ObjectId, ref: 'Bank' },
});

export default mongoose.model('Account', account, 'Accounts');
