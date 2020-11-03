/* eslint-disable func-names, object-curly-newline */
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
      Investments: { type: Number, default: 0, required: true },
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
    UnassignedSavings: this.UnassignedSavings,
    UnassignedInvestments: this.UnassignedInvestments,
    Vaults: {
      UnassignedBalances: {
        Savings: this.Vaults.UnassignedBalances.Savings,
        Investments: this.Vaults.UnassignedBalances.Investments,
      },
      BufferMonths: this.Vaults.BufferMonths,
    },
  };
};

userSchema.virtual('id')
  .set(function (newId) {
    try {
      this._id = new mongoose.Types.ObjectId(newId);
    } catch (e) {
      // New id was invalid. Don't change model's _id
    }
  });

userSchema.virtual('FullName')
  .get(function () {
    if (!this.FirstName || !this.LastName) {
      return '';
    }

    return `${this.FirstName} ${this.LastName}`;
  });

userSchema.virtual('UnassignedSavings')
  .set(function (newValue) {
    this.Vaults.UnassignedBalances.Savings = Number.parseInt((newValue * 100).toFixed(0), 10);
  })
  .get(function () {
    return Number.parseFloat((this.Vaults.UnassignedBalances.Savings / 100).toFixed(2));
  });

userSchema.virtual('UnassignedInvestments')
  .set(function (newValue) {
    this.Vaults.UnassignedBalances.Investments = Number.parseInt((newValue * 100).toFixed(0), 10);
  })
  .get(function () {
    return Number.parseFloat((this.Vaults.UnassignedBalances.Investments / 100).toFixed(2));
  });

export default mongoose.model('User', userSchema, 'Users');
