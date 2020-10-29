/* eslint-disable func-names */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Username: { type: String, required: true },
  AuthHash: { type: String, required: true },
  FirstName: { type: String },
  LastName: { type: String },
  Email: { type: String, required: true },
  Vaults: {
    UnassignedBalances: {
      Savings: { type: Number, default: 0, required: true },
      Buffer: { type: Number, default: 0, required: true },
    },
    BufferMonths: { type: Number, default: 6, min: 1, required: true },
  },
});

userSchema.methods.toJSON = function () {
  return {
    id: this.id,
    Username: this.Username,
    AuthHash: this.AuthHash,
    FirstName: this.FirstName,
    LastName: this.LastName,
    Email: this.Email,
    Vaults: {
      UnassignedBalances: {
        Savings: this.Vaults.UnassignedBalances.Savings,
        Buffer: this.Vaults.UnassignedBalances.Buffer,
      },
      BufferMonths: this.Vaults.BufferMonths,
    },
  };
};

export default mongoose.model('User', userSchema, 'Users');